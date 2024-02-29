import React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Home from './home'
import './app.css';

export const supabase = createClient('https://nqhncjioocsumibvbzyv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaG5jamlvb2NzdW1pYnZienl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxNTU1NjksImV4cCI6MjAyNDczMTU2OX0.wasSaFSLO2Zj2vx-HqEwD7aPjes5z8aM9MS0UjZxNBY')

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
	if(!session){
		supabase.auth.getSession().then(({ data: { session } }) => {
		localStorage.setItem('thinker-session',session)
		setSession(session)
		})
	}

	const {
	  data: { subscription },
	} = supabase.auth.onAuthStateChange((_event, session) => {
	  localStorage.setItem('thinker-session',session)		
	  setSession(session)
	})

	return () => subscription.unsubscribe()
  }, [])

if (!session) {
	return (
		<div style={{display:'flex', flexGrow:1, width:'40vh', height:'full', flexDirection:'column'}}>
			<h1 style={{textAlign:'center'}}>Welcome to Thinker!</h1>
			<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
		</div>
	)
  }
  else {
	return (<Home supabaseClient={supabase}/>)
  }
}