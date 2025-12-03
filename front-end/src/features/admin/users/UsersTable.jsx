import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import PersonService from '../../../services/personService';
import ProfileService from '../../../services/profileService';
import './UsersTable.scss';

const UsersTable = () => {
    const personService = new PersonService();
    const profileService = new ProfileService();
    const [users, setUsers] = useState([]);
    const [profileOptions, setProfileOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchProfiles();
    }, [])

    async function fetchUsersByName(name) {
        setLoading(true);
        try {
            const result = await personService.getByName(name);
            setUsers(result.content);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchInactiveUsers() {
        setLoading(true);
        try {
            const result = await personService.listAllInactive();
            setUsers(result.content);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchUsers() {
        setLoading(true);
        try {
            const result = await personService.getAll();
            setUsers(result.content);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    async function fetchProfiles() {
        try {
            const result = await profileService.getAll();
            const options = result.content.map(p => ({
                label: p.type,
                value: p.type
            }));
            setProfileOptions(options);
        } catch (error) {
            console.log(error)
        }
    }

    const onRowEditComplete = async (e) => {
        let _users = [...users];
        _users[e.index] = e.newData;
        setLoading(true);
        try {
            await personService.update(e.newData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        setUsers(_users);
    }

    const deleteUser = async (userId) => {
        setDeletingIds([...deletingIds, userId]);
        try {
            await personService.delete(userId);
            fetchUsers();
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingIds(prev => prev.filter(deletingId => deletingId !== userId));
        }
    };

    const restoreUser = async (userId) => {
        setDeletingIds([...deletingIds, userId]);
        try {
            await personService.restore(userId);
            fetchInactiveUsers();
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingIds(prev => prev.filter(deletingId => deletingId !== userId));
        }
    };

    const deleteButton = (rowData) => {
        return (
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDialog({
                message: 'Quer deletar este usuário?',
                header: 'Confirmação',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "Sim",
                rejectLabel: "Não",
                accept: () => deleteUser(rowData.id)
            })}
                loading={deletingIds.includes(rowData.id)}
                disabled={deletingIds.includes(rowData.id)}
            />
        );
    };

    const restoreButton = (rowData) => {
        return (
            <Button icon="pi pi-refresh" className="p-button-success" onClick={() => confirmDialog({
                message: 'Quer restaurar este usuário?',
                header: 'Confirmação',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "Sim",
                rejectLabel: "Não",
                accept: () => restoreUser(rowData.id)
            })}
                loading={deletingIds.includes(rowData.id)}
                disabled={deletingIds.includes(rowData.id)}
            />
        );
    };

    const nameEditor = (options) => {
        return (
            <InputText
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
            />
        )
    }

    const emailEditor = (options) => {
        return (
            <InputText
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
            />
        )
    }

    const profileEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={profileOptions}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder='Selecione um perfil'
            />
        )
    }

    const header = () => {
        return (
            <>
                <div id='table-header'>
                    <div>
                        <Button label="Ativos" icon="pi pi-users" className="p-button-outlined" onClick={fetchUsers} loading={loading} disabled={loading} />
                        <Button label="Inativos" icon="pi pi-user-slash" className="p-button-outlined" onClick={fetchInactiveUsers} loading={loading} disabled={loading} />
                    </div>
                    <InputText id='search' type="search" placeholder="Buscar por nome" onInput={(e) => fetchUsersByName(e.target.value)} />
                </div>
            </>
        )
    }

    return (
        <>
            <DataTable
                value={users}
                loading={loading}
                editMode='row'
                dataKey="id"
                onRowEditComplete={onRowEditComplete}
                paginator rows={10}
                header={header}
                resizableColumns columnResizeMode='fit'
                emptyMessage="Nenhum usuário encontrado."
            >
                <Column field="id" header="ID" sortable style={{ width: '5%' }} />
                <Column field="name" header="Nome" editor={nameEditor} sortable style={{ width: '35%' }} />
                <Column field="email" header="Email" editor={emailEditor} sortable style={{ width: '25%' }} />
                <Column field="profile" header="Perfil" editor={profileEditor} sortable style={{ width: '15%' }} />
                <Column rowEditor header="Editar" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }} />
                <Column field="active" header="Ação" body={rowData => rowData.active ? deleteButton(rowData) : restoreButton(rowData)} style={{ width: '10%' }} />
            </DataTable>
            <ConfirmDialog />
        </>
    )
}

export default UsersTable;