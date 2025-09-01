import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import PersonService from '../../../services/personService';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ProfileService from '../../../services/profileService';
import { Button } from 'primereact/button';

const UsersTable = () => {
    const personService = new PersonService();
    const profileService = new ProfileService();
    const [users, setUsers] = useState([]);
    const [profileOptions, setProfileOptions] = useState([]);

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
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.log(error);
        }
    };

    const deleteButton = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => deleteUser(rowData.id)}
            />
        );
    };

    const nameEditor = (options) => {
        return (
            <InputText
                value={options.value}
                onChange={(e)=>options.editorCallback(e.target.value)}
            />
        )
    }

    const emailEditor = (options) => {
        return (
            <InputText
                value={options.value}
                onChange={(e)=>options.editorCallback(e.target.value)}
            />
        )
    }

    const profileEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={profileOptions}
                onChange={(e)=>options.editorCallback(e.value)}
                placeholder='Selecione um perfil'
            />
        )
    }

    return (
        <DataTable value={users} editMode='row' dataKey="id" onRowEditComplete={onRowEditComplete}>
            <Column field="id" header="ID" />
            <Column field="name" header="Nome" editor={nameEditor}/>
            <Column field="email" header="Email" editor={emailEditor} />
            <Column field="profile" editor={profileEditor} header="Perfil" />
            <Column rowEditor header="Editar" bodyStyle={{textAlign: 'left'}}/>
            <Column body={deleteButton} header="Excluir" bodyStyle={{textAlign: 'left'}}/>
        </DataTable>
    )
}

export default UsersTable;