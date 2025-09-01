import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import ProfileService from '../../../services/profileService';
import { useEffect, useState } from 'react';

const ProfilesTable = () => {
    const profileService = new ProfileService();
    const [profiles, setProfiles] = useState([]);
    async function fetchProfiles() {
        try {
            const result = await profileService.getAll();
            setProfiles(result.content);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchProfiles();
    }, [])

    return (
        <DataTable value={profiles}>
            <Column field="id" header="ID" />
            <Column field="type" header="Perfil" />
        </DataTable>
    )
}

export default ProfilesTable;