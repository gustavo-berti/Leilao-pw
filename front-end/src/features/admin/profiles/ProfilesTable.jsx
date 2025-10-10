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

    const fetchProfiles = async () => {
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

    const fetchProfilesByName = async (name) => {
        try {
            const result = await profileService.getByName(name);
            setProfiles(result.content);
        } catch (error) {
            console.log(error);
        }
    }

    const onRowEditComplete = (e) => {
        let _profiles = [...profiles];
        _profiles[e.index] = e.newData;
        setProfiles(_profiles);
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

    const header = () => {
        return (
            <>
                <div id='add-profile'>
                    <div>
                        <InputText
                            value={newProfile}
                            placeholder='Novo perfil'
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => setNewProfile(e.target.value.toUpperCase())}
                        />
                        <Button label="Adicionar" icon="pi pi-plus" onClick={handleAddProfile} />
                    </div>
                    <InputText id='search' type="search" placeholder="Buscar por nome" onInput={(e) => fetchProfilesByName(e.target.value)} />
                </div>
            </>
        )
    }

    return (
        <>
            <DataTable
                value={profiles}
                editMode='row'
                dataKey="id"
                onRowEditComplete={onRowEditComplete}
                paginator rows={10}
                header={header}
                resizableColumns columnResizeMode='fit'
            >
                <Column field="id" header="ID" style={{ width: '5%' }} />
                <Column field="type" header="Perfil" editor={typeEditor} />
                <Column rowEditor header="Editar" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }} />
                <Column body={deleteButton} header="Ação" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }} />
            </DataTable>
        </>
    )
}

export default ProfilesTable;