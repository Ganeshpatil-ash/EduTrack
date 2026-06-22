import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Your administrator account</p>
      </div>
      <Card>
        <CardBody className="flex flex-col items-center gap-4 py-10 text-center">
          <Avatar name={user?.name} size="xl" />
          <div>
            <h2 className="text-lg font-bold">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <Badge tone="brand" className="mt-2 capitalize">{user?.role}</Badge>
          </div>
          <Button variant="secondary" onClick={() => navigate('/settings')}><FiSettings className="h-4 w-4" /> Edit in Settings</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
