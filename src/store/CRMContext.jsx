import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { enquiryAPI, clientAPI, destinationAPI } from '../services/api';

const CRMContext = createContext();

const PIPELINE_STAGES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'];
const LEAD_SOURCES = ['Website', 'Instagram', 'Facebook', 'Referral', 'Google Ads', 'Wedding Fair', 'Walk-in', 'Other'];
const CONTACT_METHODS = ['Call', 'Meeting', 'WhatsApp', 'Email'];
const EVENT_TYPES = ['Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception'];

const initialState = {
  enquiries: [],
  clients: [],
  destinations: [],
  notifications: [],
  loading: true,
};

function crmReducer(state, action) {
  switch (action.type) {
    case 'SET_ENQUIRIES':
      return { ...state, enquiries: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'SET_DESTINATIONS':
      return { ...state, destinations: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'ADD_ENQUIRY':
      return { ...state, enquiries: [action.payload, ...state.enquiries] };
    case 'UPDATE_ENQUIRY':
      return { ...state, enquiries: state.enquiries.map(e => e.enquiryId === action.payload.enquiryId ? action.payload : e) };
    case 'DELETE_ENQUIRY':
      return { ...state, enquiries: state.enquiries.filter(e => e.enquiryId !== action.payload) };

    case 'ADD_CLIENT':
      return { ...state, clients: [action.payload, ...state.clients] };
    case 'UPDATE_CLIENT':
      return { ...state, clients: state.clients.map(c => c.clientId === action.payload.clientId ? action.payload : c) };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter(c => c.clientId !== action.payload) };

    case 'ADD_DESTINATION':
      return { ...state, destinations: [...state.destinations, action.payload].sort() };
    case 'DELETE_DESTINATION':
      return { ...state, destinations: state.destinations.filter(d => d !== action.payload) };

    default:
      return state;
  }
}

// Helper to normalize enquiry data from API (map _id based sub-docs to have id field)
function normalizeEnquiry(e) {
  return {
    ...e,
    id: e.enquiryId,
    followUps: (e.followUps || []).map(f => ({ ...f, id: f._id || f.id })),
    activities: (e.activities || []).map(a => ({ ...a, id: a._id || a.id, timestamp: a.timestamp })),
  };
}

function normalizeClient(c) {
  return {
    ...c,
    id: c.clientId,
    events: (c.events || []).map(ev => ({ ...ev, id: ev._id || ev.id })),
    payments: (c.payments || []).map(p => ({ ...p, id: p._id || p.id })),
  };
}

export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [enquiries, clients, destinations] = await Promise.all([
          enquiryAPI.getAll(),
          clientAPI.getAll(),
          destinationAPI.getAll(),
        ]);
        dispatch({ type: 'SET_ENQUIRIES', payload: enquiries.map(normalizeEnquiry) });
        dispatch({ type: 'SET_CLIENTS', payload: clients.map(normalizeClient) });
        dispatch({ type: 'SET_DESTINATIONS', payload: destinations });
      } catch (err) {
        console.error('Failed to load data:', err);
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    loadData();
  }, []);

  // ── Enquiry actions ──
  const addEnquiry = useCallback(async (data) => {
    try {
      const enquiry = await enquiryAPI.create(data);
      dispatch({ type: 'ADD_ENQUIRY', payload: normalizeEnquiry(enquiry) });
    } catch (err) { console.error('Add enquiry failed:', err); }
  }, []);

  const updateEnquiryStatus = useCallback(async (enquiryId, status) => {
    try {
      const enquiry = await enquiryAPI.updateStatus(enquiryId, status);
      dispatch({ type: 'UPDATE_ENQUIRY', payload: normalizeEnquiry(enquiry) });
    } catch (err) { console.error('Update status failed:', err); }
  }, []);

  const addFollowUp = useCallback(async (enquiryId, followUp) => {
    try {
      const enquiry = await enquiryAPI.addFollowUp(enquiryId, followUp);
      dispatch({ type: 'UPDATE_ENQUIRY', payload: normalizeEnquiry(enquiry) });
    } catch (err) { console.error('Add follow-up failed:', err); }
  }, []);

  const addNote = useCallback(async (enquiryId, note) => {
    try {
      const enquiry = await enquiryAPI.update(enquiryId, { notes: note });
      dispatch({ type: 'UPDATE_ENQUIRY', payload: normalizeEnquiry(enquiry) });
    } catch (err) { console.error('Add note failed:', err); }
  }, []);

  const updateEnquiry = useCallback(async (enquiryId, data) => {
    try {
      const enquiry = await enquiryAPI.update(enquiryId, data);
      dispatch({ type: 'UPDATE_ENQUIRY', payload: normalizeEnquiry(enquiry) });
    } catch (err) { console.error('Update enquiry failed:', err); }
  }, []);

  const deleteEnquiry = useCallback(async (enquiryId) => {
    try {
      await enquiryAPI.delete(enquiryId);
      dispatch({ type: 'DELETE_ENQUIRY', payload: enquiryId });
    } catch (err) { console.error('Delete enquiry failed:', err); }
  }, []);

  // ── Client actions ──
  const convertToClient = useCallback(async (enquiryId) => {
    try {
      const client = await clientAPI.convert(enquiryId);
      dispatch({ type: 'ADD_CLIENT', payload: normalizeClient(client) });
      // Refresh enquiry to get updated status
      const enquiry = await enquiryAPI.getOne(enquiryId);
      dispatch({ type: 'UPDATE_ENQUIRY', payload: normalizeEnquiry(enquiry) });
    } catch (err) { console.error('Convert failed:', err); }
  }, []);

  const updateClient = useCallback(async (clientId, data) => {
    try {
      const client = await clientAPI.update(clientId, data);
      dispatch({ type: 'UPDATE_CLIENT', payload: normalizeClient(client) });
    } catch (err) { console.error('Update client failed:', err); }
  }, []);

  const addPayment = useCallback(async (clientId, payment) => {
    try {
      const client = await clientAPI.addPayment(clientId, payment);
      dispatch({ type: 'UPDATE_CLIENT', payload: normalizeClient(client) });
    } catch (err) { console.error('Add payment failed:', err); }
  }, []);

  const addEvent = useCallback(async (clientId, event) => {
    try {
      const client = await clientAPI.addEvent(clientId, event);
      dispatch({ type: 'UPDATE_CLIENT', payload: normalizeClient(client) });
    } catch (err) { console.error('Add event failed:', err); }
  }, []);

  const deleteClient = useCallback(async (clientId) => {
    try {
      await clientAPI.delete(clientId);
      dispatch({ type: 'DELETE_CLIENT', payload: clientId });
    } catch (err) { console.error('Delete client failed:', err); }
  }, []);

  // ── Destination actions ──
  const addDestination = useCallback(async (name) => {
    try {
      await destinationAPI.add(name);
      dispatch({ type: 'ADD_DESTINATION', payload: name });
    } catch (err) { console.error('Add destination failed:', err); }
  }, []);

  const deleteDestination = useCallback(async (name) => {
    try {
      await destinationAPI.delete(name);
      dispatch({ type: 'DELETE_DESTINATION', payload: name });
    } catch (err) { console.error('Delete destination failed:', err); }
  }, []);

  // ── Notification stubs (kept for compatibility) ──
  const markNotificationRead = useCallback(() => {}, []);
  const markAllNotificationsRead = useCallback(() => {}, []);

  return (
    <CRMContext.Provider
      value={{
        ...state,
        addEnquiry,
        updateEnquiryStatus,
        addFollowUp,
        addNote,
        convertToClient,
        updateClient,
        addPayment,
        addEvent,
        updateEnquiry,
        deleteEnquiry,
        deleteClient,
        addDestination,
        deleteDestination,
        markNotificationRead,
        markAllNotificationsRead,
        PIPELINE_STAGES,
        LEAD_SOURCES,
        DESTINATIONS: state.destinations,
        CONTACT_METHODS,
        EVENT_TYPES,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
}
