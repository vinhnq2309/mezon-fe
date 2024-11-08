import { v4 as uuidv4 } from 'uuid';
import ConnectionsAllowed from '../../pages/flows/nodes/ConnectionAlows';
import { FLOW_ACTION_TYPE, FlowActionType, IFlowState } from './flow.type';
export const initFlowState: IFlowState = {
	nodes: [],
	edges: [],
	nodeType: 'default',
	selectedNode: null,
	openModalNodeDetail: false,
	isLoading: false
};

const flowReducer = (state = initFlowState, action: FlowActionType): IFlowState => {
	switch (action.type) {
		case FLOW_ACTION_TYPE.SET_EDGES:
			return {
				...state,
				edges: action.payload
			};
		case FLOW_ACTION_TYPE.SET_NODES:
			return {
				...state,
				nodes: action.payload
			};
		case FLOW_ACTION_TYPE.CHANGE_LOADING:
			return {
				...state,
				isLoading: action.payload
			};
		case FLOW_ACTION_TYPE.ADD_NODE: {
			const newNodeId: string = uuidv4();
			const newNode = {
				id: newNodeId,
				type: state.nodeType,
				position: action.payload,
				dragHandle: '.custom-drag-handle',
				data: {
					label: state.nodeType,
					id: newNodeId
				}
			};
			return {
				...state,
				nodes: [...state.nodes, newNode]
			};
		}
		case FLOW_ACTION_TYPE.ADD_EDGE: {
			const newEdge = action.payload;
			newEdge.id = uuidv4();
			// check if connection is exist
			const checkExist = state.edges.find(
				(edge) =>
					edge.source === newEdge.source &&
					edge.target === newEdge.target &&
					edge.sourceHandle === newEdge.sourceHandle &&
					edge.targetHandle === newEdge.targetHandle
			);
			// check if connection is not allowed
			const checkAllowed = ConnectionsAllowed.find((item) => {
				return item.source === newEdge.sourceHandle && item.target === newEdge.targetHandle;
			});
			// check if connection is limit
			const checkLimit = state.edges.find(
				(edge) =>
					(edge.sourceHandle === newEdge.sourceHandle && edge.source === newEdge.source) ||
					(edge.targetHandle === newEdge.targetHandle && edge.target === newEdge.target)
			);
			if (!checkAllowed || checkExist || checkLimit) return state;
			return {
				...state,
				edges: [...state.edges, newEdge]
			};
		}
		case FLOW_ACTION_TYPE.CHANGE_NODE_TYPE:
			return {
				...state,
				nodeType: action.payload
			};
		case FLOW_ACTION_TYPE.COPY_NODE: {
			const { nodeId, defaultValue } = action.payload;
			const nodeToCopy = state.nodes.find((node) => node.id === nodeId);
			if (!nodeToCopy) return state;
			const idCopnyNode = uuidv4();
			const copyNode = {
				...nodeToCopy,
				id: idCopnyNode,
				position: {
					x: nodeToCopy.position.x + 50,
					y: nodeToCopy.position.y + 50
				},
				selected: false,
				data: {
					...nodeToCopy.data,
					defaultValue,
					id: idCopnyNode
				}
			};
			return {
				...state,
				nodes: [...state.nodes, copyNode]
			};
		}

		case FLOW_ACTION_TYPE.DELETE_NODE: {
			const nodeIdToDelete = action.payload;
			return {
				...state,
				nodes: state.nodes?.filter((node) => node.id !== nodeIdToDelete),
				edges: state.edges?.filter((e: { source: string; target: string }) => e.source !== nodeIdToDelete && e.target !== nodeIdToDelete)
			};
		}

		case FLOW_ACTION_TYPE.CHANGE_OPEN_MODAL_NODE_DETAIL:
			return {
				...state,
				openModalNodeDetail: action.payload
			};
		case FLOW_ACTION_TYPE.CHANGE_SELECTED_NODE:
			return {
				...state,
				selectedNode: action.payload
			};
		default:
			return state;
	}
};
export default flowReducer;
