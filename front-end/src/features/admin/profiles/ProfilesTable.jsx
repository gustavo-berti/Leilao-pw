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
    const [loading, setLoading] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const result = await profileService.getAll();
            setProfiles(result.content);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchProfilesByName = async (name) => {
        setLoading(true);
        try {
            const result = await profileService.getByName(name);
            setProfiles(result.content);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const onRowEditComplete = async (e) => {
        let _profiles = [...profiles];
        _profiles[e.index] = e.newData;
        setLoading(true);
        try {
            await profileService.update(e.newData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        setProfiles(_profiles);
    }

    const handleDelete = async (id) => {
        setDeletingIds([...deletingIds, id]);
        try {
            await profileService.delete(id);
            setProfiles(profiles.filter(profile => profile.id !== id));
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
        }
    };

    const handleAddProfile = async () => {
        if (!newProfile) return;
        setLoading(true);
        try {
            const result = await profileService.insert({ type: newProfile });
            setProfiles([...profiles, result]);
            fetchProfiles();
            setNewProfile('');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const deleteButton = (rowData) => {
        const isDeleting = deletingIds.includes(rowData.id);
        return (
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowData.id)} loading={isDeleting} disabled={isDeleting} />
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
                        <Button label="Adicionar" icon="pi pi-plus" onClick={handleAddProfile} loading={loading} disabled={loading || !newProfile} />
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
                loading={loading}
                editMode='row'
                dataKey="id"
                onRowEditComplete={onRowEditComplete}
                paginator rows={10}
                header={header}
                resizableColumns columnResizeMode='fit'
                emptyMessage="Nenhum perfil encontrado."
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