import styles from './styles.module.scss'

import io from 'socket.io-client'
import LogoImg from '../../assets/logo.svg'
import { useEffect, useState } from 'react'
import { api } from '../../services'

interface IMessages {
  created_at: string
  id: string
  text: string
  user: {
    avatar_url: string
    github_id: number
    id: string
    login: string
    name: string
  }
  user_id: string
}

const messageQueue: IMessages[] = []

const socket = io('https://nlw-heat-give-me-feedback.herokuapp.com/')

socket.on('new_message', (newMessage: IMessages) => {
  messageQueue.push(newMessage)
})

export function MessageList (){
  
  const [messages, setMesssages] = useState<IMessages[]>([])

  const getLastThreeMessages = async () => {
    try {
      const { data } = await api.get<IMessages[]>('/messages/last3')
      setMesssages([...data])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getLastThreeMessages()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if(messageQueue.length > 0){
        setMesssages(prevState => [
          messageQueue[0],
          prevState[0],
          prevState[1]
        ].filter(Boolean))

        messageQueue.shift()
      }
    }, 3000)

  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={LogoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {
          messages.map( (item, index) => {
            return (
              <li className={styles.message} key={index}>
                <p>{item.text}</p>
                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img src={item.user.avatar_url} alt="Julio Levi" />
                  </div>
                  <span>{item.user.name}</span>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}