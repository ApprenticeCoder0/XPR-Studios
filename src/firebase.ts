import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Ticket, User, TicketSituation, TicketGrade, TicketTime, UserRole } from './types';

// The user requested to leave Firebase prepared for later use.
// Just fill in your config here when ready.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (Currently disabled until config is provided)
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

/* 
=============================================================================
DATABASE STRUCTURE PLANNED:

Collections:
- users
  - id (string)
  - name (string)
  - email (string)
  - role (number/enum)
  - profilePicture (string)
  
- tickets
  - id (string)
  - title (string)
  - description (string)
  - authorId (string)
  - category (string)
  - createdAt (timestamp)
  - situation (string/enum)
  - grade (string/enum)
  - time (string/enum)

- ticket_messages (sub-collection or root collection tied to ticketId)
  - id (string)
  - ticketId (string)
  - authorId (string)
  - message (string)
  - createdAt (timestamp)
  - isStaffResponse (boolean)

=============================================================================
*/

// MOCK FUNCTIONS PREPARED FOR FIREBASE

export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt'>) => {
  // const docRef = await addDoc(collection(db, 'tickets'), {
  //   ...ticketData,
  //   createdAt: serverTimestamp(),
  // });
  // return docRef.id;
  console.log("Firebase not connected. Prepared createTicket:", ticketData);
  return "mock-id-123";
};

export const subscribeToTickets = (callback: (tickets: Ticket[]) => void) => {
  // const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
  // return onSnapshot(q, (snapshot) => {
  //   const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
  //   callback(tickets);
  // });
  console.log("Firebase not connected. Prepared subscribeToTickets.");
  return () => {}; // unsubscribe function
};

export const updateTicketStatus = async (ticketId: string, situation: TicketSituation, grade?: TicketGrade, time?: TicketTime) => {
  // const ticketRef = doc(db, 'tickets', ticketId);
  // const updates: any = { situation };
  // if (grade) updates.grade = grade;
  // if (time) updates.time = time;
  // await updateDoc(ticketRef, updates);
  console.log("Firebase not connected. Prepared updateTicketStatus:", { ticketId, situation, grade, time });
};
