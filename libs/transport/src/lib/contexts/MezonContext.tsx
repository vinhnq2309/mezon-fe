import React, { useCallback } from "react";
import { CreateNakamaClientOptions, createClient as createNakamaClient } from "../nakama";
import { Client, Session, Socket, Channel } from "@mezon/mezon-js";
import { DeviceUUID } from "device-uuid";

type MezonContextProviderProps = {
    children: React.ReactNode;
    nakama: CreateNakamaClientOptions;
    connect?: boolean;
};

type Sessionlike = {
    token: string;
    refresh_token: string;
    created: boolean;
};

export type MezonContextValue = {
    clientRef: React.MutableRefObject<Client | null>;
    sessionRef: React.MutableRefObject<Session | null>;
    socketRef: React.MutableRefObject<Socket | null>;
    channelRef: React.MutableRefObject<Channel | null>;
    createClient: () => Promise<Client>;
    authenticateEmail: (email: string, password: string) => Promise<Session>;
    authenticateDevice: (username: string) => Promise<Session>;
    authenticateGoogle: (token: string) => Promise<Session>;
    refreshSession: (session: Sessionlike) => Promise<Session>;
    joinChatChannel: (channelId: string, channelName?: string, channelType?: number) => Promise<Channel>;
};

const MezonContext = React.createContext<MezonContextValue>({} as MezonContextValue);

const MezonContextProvider: React.FC<MezonContextProviderProps> = ({ children, nakama, connect }) => {
    const clientRef = React.useRef<Client | null>(null);
    const sessionRef = React.useRef<Session | null>(null);
    const socketRef = React.useRef<Socket | null>(null);
    const channelRef = React.useRef<Channel | null>(null);

    const createSocket = useCallback(async () => {
        if (!clientRef.current) {
            throw new Error("Nakama client not initialized");
        }
        const socket = clientRef.current.createSocket();
        socketRef.current = socket;
        return socket;
    }, [clientRef, socketRef]);

    const createClient = useCallback(async () => {
        const client = await createNakamaClient(nakama);
        clientRef.current = client;
        return client;
    }, [nakama]);

    const authenticateEmail = useCallback(
        async (email: string, password: string) => {
            if (!clientRef.current) {
                throw new Error("Nakama client not initialized");
            }
            const session = await clientRef.current.authenticateEmail(email, password, true);
            sessionRef.current = session;

            if (!socketRef.current) {
                return session;
            }

            const session2 = await socketRef.current.connect(session, false);
            sessionRef.current = session2;

            return session;
        },
        [clientRef, socketRef],
    );

    const authenticateGoogle = useCallback(
        async (token: string) => {
            if (!clientRef.current) {
                throw new Error("Nakama client not initialized");
            }
            const session = await clientRef.current.authenticateGoogle(token);
            sessionRef.current = session;

            if (!socketRef.current) {
                return session;
            }

            const session2 = await socketRef.current.connect(session, false);
            sessionRef.current = session2;

            return session;
        },
        [clientRef, socketRef],
    );

    const authenticateDevice = useCallback(
        async (username: string) => {
            if (!clientRef.current) {
                throw new Error("Nakama client not initialized");
            }

            const deviceId = new DeviceUUID().get();

            const session = await clientRef.current.authenticateDevice(deviceId, true, username);
            sessionRef.current = session;
            return session;
        },
        [clientRef],
    );

    const refreshSession = useCallback(
        async (session: Sessionlike) => {
            if (!clientRef.current) {
                throw new Error("Nakama client not initialized");
            }
            const newSession = await clientRef.current.sessionRefresh(new Session(session.token, session.refresh_token, session.created));
            sessionRef.current = newSession;

            if (!socketRef.current) {
                return newSession;
            }

            const session2 = await socketRef.current.connect(newSession, false);
            sessionRef.current = session2;

            return newSession;
        },
        [clientRef, socketRef],
    );

    const joinChatChannel = React.useCallback(
        async (channelId: string, channelName?: string | undefined, channelType?: number | undefined) => {
            console.log(channelId, channelName, channelType);
            const socket = socketRef.current;

            if (!socket) {
                throw new Error("Socket is not initialized");
            }

            if (channelRef.current) {
                await socket.leaveChat(channelRef.current.id);
                channelRef.current = null;
            }

            console.log("channeRf.current", channelRef.current)

            console.log("joined are:", channelId, channelName, channelType);
            const join = await socket.joinChat(channelId, channelName || "", channelType ?? 1, true, false);
            console.log("joinedOK", join);
            channelRef.current = join;
            return join;
        },
        [socketRef],
    );

    const value = React.useMemo<MezonContextValue>(
        () => ({
            clientRef,
            sessionRef,
            socketRef,
            channelRef,
            createClient,
            authenticateDevice,
            authenticateEmail,
            authenticateGoogle,
            refreshSession,
            joinChatChannel,
            createSocket,
        }),
        [clientRef, sessionRef, socketRef, channelRef, createClient, authenticateDevice, authenticateEmail, authenticateGoogle, refreshSession, joinChatChannel, createSocket],
    );

    React.useEffect(() => {
        if (connect) {
            createClient().then(() => {
                return createSocket();
            });
        }
    }, [connect, createClient, createSocket]);

    return <MezonContext.Provider value={value}>{children}</MezonContext.Provider>;
};

const MezonContextConsumer = MezonContext.Consumer;

export type MezonSuspenseProps = {
    children: React.ReactNode;
};

const MezonSuspense: React.FC<MezonSuspenseProps> = ({ children }: MezonSuspenseProps) => {
    const { clientRef, sessionRef, socketRef } = React.useContext(MezonContext);
    if (!clientRef.current || !sessionRef.current || !socketRef.current) {
        return <>Loading...</>;
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
};

export { MezonContext, MezonContextProvider, MezonContextConsumer, MezonSuspense };
