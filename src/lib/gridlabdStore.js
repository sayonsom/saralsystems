import { createContext, useContext, useReducer, useEffect } from 'react';
import { projects as projectsAPI, simulations as simulationsAPI, user as userAPI } from './gridlabdClient';
import { apiFetch } from './api';

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  selectedProjectId: null,
  files: [],
  openFiles: [],
  simulations: [],
  userProfile: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Reducer for state updates
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload || [] };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload, selectedProjectId: action.payload?.id };
    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload };
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] };
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(f => f.id === action.payload.id ? action.payload : f),
        openFiles: state.openFiles.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'DELETE_FILE':
      return {
        ...state,
        files: state.files.filter(f => f.id !== action.payload),
        openFiles: state.openFiles.filter(f => f.id !== action.payload)
      };
    case 'SET_OPEN_FILES':
      return { ...state, openFiles: action.payload };
    case 'ADD_OPEN_FILE':
      return { ...state, openFiles: [...state.openFiles.filter(f => f.id !== action.payload.id), action.payload] };
    case 'UPDATE_OPEN_FILE':
      return {
        ...state,
        openFiles: state.openFiles.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'SET_SIMULATIONS':
      return { ...state, simulations: action.payload || [] };
    case 'ADD_SIMULATION':
      return { ...state, simulations: [...state.simulations, action.payload] };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload, isAuthenticated: !!action.payload };
    case 'LOGOUT':
      return { ...initialState, isAuthenticated: false };
    default:
      return state;
  }
};

// Context
const GridLABDContext = createContext();

// Provider
export const GridLABDProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const profile = await userAPI.profile();
        dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        // Anonymous mode
        dispatch({ type: 'SET_USER_PROFILE', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadUserProfile();
  }, []);

  // Load projects
  const loadProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await projectsAPI.list({ limit: 50, offset: 0 });
      dispatch({ type: 'SET_PROJECTS', payload: data || [] });
      if (data.length > 0 && !state.selectedProjectId) {
        const firstProject = data[0];
        dispatch({ type: 'SELECT_PROJECT', payload: firstProject.id });
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: firstProject });
        await loadProjectFiles(firstProject.id);
        await loadProjectSimulations(firstProject.id);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load current project details
  const loadCurrentProject = async (projectId) => {
    try {
      const project = await projectsAPI.get(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Load project files
  const loadProjectFiles = async (projectId) => {
    try {
      const data = await projectsAPI.listFiles(projectId);
      dispatch({ type: 'SET_FILES', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Load project simulations
  const loadProjectSimulations = async (projectId) => {
    try {
      const data = await projectsAPI.listSimulations(projectId, { limit: 50, offset: 0 });
      dispatch({ type: 'SET_SIMULATIONS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Create project
  const createProject = async (data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newProject = await projectsAPI.create(data);
      dispatch({ type: 'SET_PROJECTS', payload: [...(Array.isArray(state.projects) ? state.projects : []), newProject] });
      dispatch({ type: 'SELECT_PROJECT', payload: newProject.id });
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject });
      await loadProjectFiles(newProject.id);
      return newProject;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update project
  const updateProject = async (projectId, data) => {
    try {
      const updated = await projectsAPI.update(projectId, data);
      dispatch({ type: 'SET_PROJECTS', payload: state.projects.map(p => p.id === projectId ? updated : p) });
      if (state.selectedProjectId === projectId) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: updated });
      }
      return updated;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      await projectsAPI.delete(projectId);
      const newProjects = state.projects.filter(p => p.id !== projectId);
      dispatch({ type: 'SET_PROJECTS', payload: newProjects });
      if (state.selectedProjectId === projectId) {
        dispatch({ type: 'SELECT_PROJECT', payload: newProjects[0]?.id || null });
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProjects[0] || null });
        dispatch({ type: 'SET_FILES', payload: [] });
        dispatch({ type: 'SET_SIMULATIONS', payload: [] });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Select project
  const selectProject = async (projectId) => {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      await loadProjectFiles(projectId);
      await loadProjectSimulations(projectId);
    }
  };

  // File actions
  const createFile = async (projectId, data) => {
    try {
      const newFile = await projectsAPI.createFile(projectId, data);
      dispatch({ type: 'ADD_FILE', payload: newFile });
      return newFile;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateFile = async (projectId, fileId, data) => {
    try {
      const updated = await projectsAPI.updateFile(projectId, fileId, data);
      dispatch({ type: 'UPDATE_FILE', payload: updated });
      return updated;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteFile = async (projectId, fileId) => {
    try {
      await projectsAPI.deleteFile(projectId, fileId);
      dispatch({ type: 'DELETE_FILE', payload: fileId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const bulkSaveFiles = async (projectId, data) => {
    try {
      const results = await projectsAPI.bulkSave(projectId, data);
      // Update files with new etags or versions
      dispatch({ type: 'SET_FILES', payload: results.files || state.files });
      return results;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Simulation actions
  const runSimulation = async (data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sim = await simulationsAPI.create(data);
      dispatch({ type: 'ADD_SIMULATION', payload: sim });
      return sim;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const runArchiveSimulation = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sim = await simulationsAPI.archive(formData);
      dispatch({ type: 'ADD_SIMULATION', payload: sim });
      return sim;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const cancelSimulation = async (simulationId) => {
    try {
      await simulationsAPI.cancel(simulationId);
      dispatch({ type: 'SET_SIMULATIONS', payload: state.simulations.map(s => s.id === simulationId ? { ...s, status: 'cancelled' } : s) });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const getSimulationConsole = async (simulationId) => {
    try {
      return await simulationsAPI.console(simulationId);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const downloadOutputs = async (simulationId) => {
    try {
      return await simulationsAPI.outputsZip(simulationId);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Open file
  const openFile = (file) => {
    if (!state.openFiles.find(f => f.id === file.id)) {
      dispatch({ type: 'ADD_OPEN_FILE', payload: file });
    }
  };

  // Close file
  const closeFile = (fileId) => {
    dispatch({ type: 'SET_OPEN_FILES', payload: state.openFiles.filter(f => f.id !== fileId) });
  };

  const value = {
    state,
    dispatch,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    loadCurrentProject,
    createFile,
    updateFile,
    deleteFile,
    bulkSaveFiles,
    loadProjectFiles,
    runSimulation,
    runArchiveSimulation,
    cancelSimulation,
    getSimulationConsole,
    downloadOutputs,
    loadProjectSimulations,
    openFile,
    closeFile,
    updateOpenFile: (file) => dispatch({ type: 'UPDATE_OPEN_FILE', payload: file })
  };

  return (
    <GridLABDContext.Provider value={value}>
      {children}
    </GridLABDContext.Provider>
  );
};

// Hook
export const useGridLABD = () => {
  const context = useContext(GridLABDContext);
  if (!context) {
    throw new Error('useGridLABD must be used within GridLABDProvider');
  }
  return context;
};