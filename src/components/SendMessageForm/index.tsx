import { FormEvent, useContext, useEffect, useState } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'
import { api } from '../../services'
import styles from './styles.module.scss'

export function SendMessageForm (){

  const [message, setMessage] = useState('')
  const [canSendMessage, setCanSendMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { user, signOut } = useContext(AuthContext)

  async function handleSubmitForm(event: FormEvent){
    event.preventDefault()
    if(!canSendMessage) return
    setIsLoading(true)

    if (!message.trim()) return
    try {
      await api.post('/messages', { message })
      setMessage('')
      setCanSendMessage(false)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if(!canSendMessage) {
      setTimeout(() => {
        setCanSendMessage(true)
      }, 5000)
    }
  }, [canSendMessage])

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size={32} />
      </button>
      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form className={styles.sendMessageForm} onSubmit={handleSubmitForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          onChange={({ target}) => setMessage(target.value)}
          name="message"
          id="message"
          value={message}
          placeholder="Qual a usa expectativa para o evento?"
        />

        <button type="submit" disabled={isLoading} className={`${canSendMessage ? '' : styles.buttonSubmitReloading}`}>
          {
            isLoading ? 
            <span>
              Enviando mensagem...
            </span>
            :
            <span>
              Enviar mensagem
            </span>
          }
        </button>
      </form>
    </div>
  )
}