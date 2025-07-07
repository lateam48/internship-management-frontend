"use client"

import { LoadingContent } from '@/components/global/loading-content';
import { EmptyState } from '@/components/global/empty-state';
import { User } from 'lucide-react';
import ProfileForm from './ProfileForm';
import { useMe } from '@/hooks/useStaff';

export default function Profile() {
    const { data: user, isLoading } = useMe();

    if (isLoading) {
        return <LoadingContent loadingText="Chargement du profil..." icon={User} />;
    }

    if (!user) {
        return (
            <EmptyState
                icon={User}
                title="Aucun utilisateur connecté"
                description="Aucune donnée de profil n'a été trouvée pour l'utilisateur connecté."
            />
        );
    }

    return <ProfileForm user={user} />;
}
