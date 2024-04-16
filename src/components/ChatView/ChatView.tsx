import * as React from 'react';
import { makeStyles } from '../../styles';

import { Box, SxProps } from '@mui/material';

import dayjs from 'dayjs';

import { ChatController } from './helpers/ChatController';

import ActionRequest from './model/ActionRequest';
import AudioActionRequest from './model/AudioActionRequest';
import CustomActionRequest from './model/CustomActionRequest';
import FileActionRequest from './model/FileActionRequest';
import MultiSelectActionRequest from './model/MultiSelectActionRequest';
import SelectActionRequest from './model/SelectActionRequest';
import TextActionRequest from './model/TextActionRequest';

import AudioInput from './components/AudioInput';
import FileInput from './components/FileInput';
import MultiSelectInput from './components/MultiSelectInput';
import SelectInput from './components/SelectInput';
import TextInput from './components/TextInput';

import ChatMessage from './view/ChatMessage';

const useStyles = makeStyles()((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        p: 1,
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            maxWidth: '100%',
        },
        '& > * + *': {
            mt: 1,
        },
    }
}));

/** 
 * @interface IChatViewProps - Interface representing props for a chat view component.
 * @property chatController - The chat controller associated with the chat view.
 * @property [className] - Additional CSS class name(s) for styling (optional).
 * @property [style] - Inline style object for additional styling (optional).
 * @property [sx] - The system props from Theme UI for additional styling (optional).
 */
interface IChatViewProps {
    chatController: ChatController;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
}

/**
 * Represents a chat view component.
 * @param props - The props object.
 * @param props.chatController - The chat controller object.
 * @param [props.className] - Additional class name(s) for the component.
 * @param [props.style] - Inline styles for the component.
 * @param [props.sx] - The sx prop from Theme UI for custom styling.
 * @returns React component.
 * @example
 * function App(): React.ReactElement {
 *  const [chatCtl] = React.useState(new ChatController());
 *
 *  React.useMemo(async () => {
 *    // Chat content is displayed using ChatController
 *    await chatCtl.addMessage({
 *      type: 'text',
 *      content: `Hello, What's your name.`,
 *      self: false,
 *    });
 *    const name = await chatCtl.setActionRequest({ type: 'text' });
 *  }, [chatCtl]);
 *
 *  // Only one component used for display
 *  return <Chat chatController={chatCtl} />;
 * }
 */
export const ChatView = ({
    chatController,
    className,
    style,
    sx,
}: IChatViewProps) => {

    const { classes, cx } = useStyles();

    const chatCtl = chatController;
    const [messages, setMessages] = React.useState(chatCtl.getMessages());
    const [actReq, setActReq] = React.useState(chatCtl.getActionRequest());

    const msgRef = React.useRef<HTMLDivElement>(null);
    const scroll = React.useCallback((): void => {
        if (msgRef.current) {
            msgRef.current.scrollTop = msgRef.current.scrollHeight;
            // msgRef.current.scrollIntoView(true);
        }
    }, [msgRef]);
    React.useEffect(() => {
        function handleMassagesChanged(): void {
            setMessages([...chatCtl.getMessages()]);
            scroll();
        }
        function handleActionChanged(): void {
            setActReq(chatCtl.getActionRequest());
            scroll();
        }
        chatCtl.addOnMessagesChanged(handleMassagesChanged);
        chatCtl.addOnActionChanged(handleActionChanged);
    }, [chatCtl, scroll]);

    type CustomComponentType = React.FC<{
        chatController: ChatController;
        actionRequest: ActionRequest;
    }>;
    const CustomComponent = React.useMemo((): CustomComponentType => {
        if (!actReq || actReq.type !== 'custom') {
            return null as unknown as CustomComponentType;
        }
        return (actReq as CustomActionRequest)
            .Component as unknown as CustomComponentType;
    }, [actReq]);

    const unknownMsg = {
        type: 'text',
        content: 'Unknown message.',
        self: false,
    };

    let prevDate = dayjs(0);
    let prevTime = dayjs(0);

    return (
        <Box
            className={cx(className, classes.root)}
            style={style}
            sx={sx}
        >
            <Box
                sx={{
                    flex: '1 1 0%',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    display: 'flex',
                    flexDirection: 'column',
                    '& > *': {
                        maxWidth: '100%',
                    },
                }}
                ref={msgRef}
            >
                {messages.map((msg): React.ReactElement => {
                    let showDate = false;
                    let showTime = !!chatCtl.getOption().showDateTime;
                    if (!!chatCtl.getOption().showDateTime && !msg.deletedAt) {
                        const current = dayjs(
                            msg.updatedAt ? msg.updatedAt : msg.createdAt,
                        );

                        if (current.format('YYYYMMDD') !== prevDate.format('YYYYMMDD')) {
                            showDate = true;
                        }
                        prevDate = current;

                        if (current.diff(prevTime) < 60_000) {
                            showTime = false;
                        } else {
                            prevTime = current;
                        }
                    }
                    if (msg.type === 'text' || msg.type === 'jsx') {
                        return (
                            <ChatMessage
                                key={messages.indexOf(msg)}
                                id={`cu-msg-${messages.indexOf(msg) + 1}`}
                                message={msg}
                                showDate={showDate}
                                showTime={showTime}
                            />
                        );
                    }
                    return (
                        <ChatMessage
                            key={messages.indexOf(msg)}
                            id={`cu-msg-${messages.indexOf(msg) + 1}`}
                            message={unknownMsg}
                            showDate={showDate}
                            showTime={showTime}
                        />
                    );
                })}
            </Box>
            <Box
                sx={{
                    flex: '0 1 auto',
                    display: 'flex',
                    alignContent: 'flex-end',
                    '& > *': {
                        minWidth: 0,
                    },
                }}
            >
                {actReq && actReq.type === 'text' && (
                    <TextInput
                        chatController={chatCtl}
                        actionRequest={actReq as TextActionRequest}
                    />
                )}
                {actReq && actReq.type === 'select' && (
                    <SelectInput
                        chatController={chatCtl}
                        actionRequest={actReq as SelectActionRequest}
                    />
                )}
                {actReq && actReq.type === 'multi-select' && (
                    <MultiSelectInput
                        chatController={chatCtl}
                        actionRequest={actReq as MultiSelectActionRequest}
                    />
                )}
                {actReq && actReq.type === 'file' && (
                    <FileInput
                        chatController={chatCtl}
                        actionRequest={actReq as FileActionRequest}
                    />
                )}
                {actReq && actReq.type === 'audio' && (
                    <AudioInput
                        chatController={chatCtl}
                        actionRequest={actReq as AudioActionRequest}
                    />
                )}
                {actReq && actReq.type === 'custom' && (
                    <CustomComponent
                        chatController={chatCtl}
                        actionRequest={actReq as CustomActionRequest}
                    />
                )}
            </Box>
        </Box>
    );
}

export default ChatView;
