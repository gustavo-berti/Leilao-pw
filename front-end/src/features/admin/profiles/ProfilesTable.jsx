import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import ProfileService from '../../../services/profileService';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './ProfilesTable.scss';

const ProfilesTable = () => {
    const profileService = new ProfileService();
    const [profiles, setProfiles] = useState([]);
    const [newProfile, setNewProfile] = useState('');

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

    const onRowEditComplete = (e) => {
        let _profiles = [...profiles];
        _profiles[e.index] = e.newData;
        setProfiles(_profiles);
        console.log(e.newData);
        profileService.update(e.newData);
    }

    const handleDelete = async (id) => {
        try {
            await profileService.delete(id);
            setProfiles(profiles.filter(profile => profile.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddProfile = async () => {
        if (!newProfile) return;
        try {
            const result = await profileService.insert({ type: newProfile });
            setProfiles([...profiles, result]);
            fetchProfiles();
            setNewProfile('');
        } catch (error) {
            console.log(error);
        }
    }

    const deleteButton = (rowData) => {
        return (
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowData.id)} />
        )
    }

    const typeEditor = (options) => {
        return (
            <InputText
                value={options.value}
                style={{ textTransform: 'uppercase' }}
                onChange={(e) => options.editorCallback(e.target.value.toUpperCase())}
            />
        )
    }

    return (
        <>
            <div id='add-profile'>
                <InputText
                    value={newProfile}
                    placeholder='Novo perfil'
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => setNewProfile(e.target.value.toUpperCase())}
                />
                <Button label="Adicionar" icon="pi pi-plus" onClick={handleAddProfile} />
            </div>
            <DataTable value={profiles} editMode='row' dataKey="id" onRowEditComplete={onRowEditComplete}>
                <Column field="id" header="ID" />
                <Column field="type" header="Perfil" editor={typeEditor} />
                <Column rowEditor header="Editar" bodyStyle={{ textAlign: 'left' }} />
                <Column body={deleteButton} header="Excluir" bodyStyle={{ textAlign: 'left' }} />
            </DataTable>
        </>
    )
}

export default ProfilesTable;