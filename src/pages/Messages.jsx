import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import styles from './Messages.module.css';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listing');

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [user, navigate]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(full_name), receiver:profiles!receiver_id(full_name), listing:listings(title)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const grouped = {};
      data?.forEach(msg => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const key = `${msg.listing_id}-${otherUserId}`;

        if (!grouped[key]) {
          grouped[key] = {
            listing_id: msg.listing_id,
            listing_title: msg.listing?.title,
            other_user_id: otherUserId,
            other_user_name: msg.sender_id === user.id ? msg.receiver.full_name : msg.sender.full_name,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread: msg.receiver_id === user.id && !msg.read,
          };
        }
      });

      setConversations(Object.values(grouped));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (listingId, otherUserId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(full_name)')
        .eq('listing_id', listingId)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId)
        .eq('listing_id', listingId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: user.id,
          receiver_id: selectedConversation.other_user_id,
          listing_id: selectedConversation.listing_id,
          content: newMessage,
        },
      ]);

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation.listing_id, selectedConversation.other_user_id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv.listing_id, conv.other_user_id);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.messagesPage}>
      <AdBanner />
      <div className="container" style={{ paddingTop: '220px' }}>
        <BackButton />
        <div className={styles.messagesContainer}>
          <div className={styles.conversationsList}>
            <h2>Conversations</h2>
            {conversations.length === 0 ? (
              <p className={styles.empty}>Aucune conversation</p>
            ) : (
              conversations.map((conv, index) => (
                <div
                  key={index}
                  className={`${styles.conversationItem} ${selectedConversation?.other_user_id === conv.other_user_id && selectedConversation?.listing_id === conv.listing_id ? styles.active : ''}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className={styles.conversationInfo}>
                    <div className={styles.conversationName}>
                      {conv.other_user_name}
                      {conv.unread && <span className={styles.unreadBadge}>•</span>}
                    </div>
                    <div className={styles.conversationListing}>{conv.listing_title}</div>
                    <div className={styles.conversationPreview}>{conv.last_message}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.chatArea}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div>
                    <h3>{selectedConversation.other_user_name}</h3>
                    <p>{selectedConversation.listing_title}</p>
                  </div>
                </div>

                <div className={styles.messagesList}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.message} ${msg.sender_id === user.id ? styles.sent : styles.received}`}
                    >
                      <div className={styles.messageContent}>{msg.content}</div>
                      <div className={styles.messageTime}>
                        {new Date(msg.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className={styles.messageForm}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                  />
                  <button type="submit" className="btn btn-primary">
                    Envoyer
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.noSelection}>
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
