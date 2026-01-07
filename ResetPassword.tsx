import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { LocadzLogo } from './components/Navbar';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] 
