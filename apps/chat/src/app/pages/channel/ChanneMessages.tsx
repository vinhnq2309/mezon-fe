import { IMessageWithUser } from '@mezon/utils'
import { ChannelMessage } from './ChannelMessage'
import { useChat } from '@mezon/core'

export default function ChannelMessages() {
    const { messages } = useChat()
    // console.log('AAAAA: ', messages[0])

    return (
        <>
            {messages.map((message, i) => (
                <ChannelMessage key={i} message={message.content as IMessageWithUser} />
            ))}
        </>
    )
}
