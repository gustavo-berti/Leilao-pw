import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import PersonService from '../../../services/personService';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ProfileService from '../../../services/profileService';
import { Button } from 'primereact/button';
import './UsersTable.scss';

const UsersTable = () => {
    const personService = new PersonService();
    const profileService = new ProfileService();
    const [users, setUsers] = useState([]);
    const [profileOptions, setProfileOptions] = useState([]);

    async function fetchUsersByName(name) {
        try {
            const result = await personService.getByName(name);
            setUsers(result.content);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchInactiveUsers() {
        try {
            const result = await personService.listAllInactive();
            setUsers(result.content);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUsers() {
        try {
            const result = await personService.getAll();
            setUsers(result.content);
        } catch (error) {
            console.log(error)
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

    useEffect(() => {
        fetchUsers();
        fetchProfiles();
    }, [])

    const onRowEditComplete = (e) => {
        let _users = [...users];
        _users[e.index] = e.newData;
        setUsers(_users);
        console.log(e.newData);
        personService.update(e.newData);
    }

    const deleteUser = async (userId) => {
        try {
            await personService.delete(userId);
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const restoreUser = async (userId) => {
        try {
            await personService.restore(userId);
            fetchInactiveUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteButton = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => {
                    deleteUser(rowData.id);
                }}
            />
        );
    };

    const restoreButton = (rowData) => {
        return (
            <Button
                icon="pi pi-refresh"
                className="p-button-success"
                onClick={() => {
                    restoreUser(rowData.id);
                }}
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
                        <Button label="Ativos" icon="pi pi-users" className="p-button-outlined" onClick={fetchUsers} />
                        <Button label="Inativos" icon="pi pi-user-slash" className="p-button-outlined" onClick={fetchInactiveUsers} />
                    </div>
                    <InputText id='search' type="search" placeholder="Buscar por nome" onInput={(e) => fetchUsersByName(e.target.value)} />
                </div>
            </>
        )
    }

    return (
        <DataTable
            value={users}
            editMode='row'
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
            paginator rows={10}
            header={header}
            resizableColumns columnResizeMode='fit'
        >
            <Column field="id" header="ID" sortable style={{ width: '5%' }} />
            <Column field="name" header="Nome" editor={nameEditor} sortable style={{ width: '35%' }} />
            <Column field="email" header="Email" editor={emailEditor} sortable style={{ width: '25%' }} />
            <Column field="profile" header="Perfil" editor={profileEditor} sortable style={{ width: '15%' }} />
            <Column rowEditor header="Editar" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }} />
            <Column field="active" header="Ação" body={rowData => rowData.active ? deleteButton(rowData) : restoreButton(rowData)} style={{ width: '10%' }} />
        </DataTable>
    )
}

export default UsersTable;