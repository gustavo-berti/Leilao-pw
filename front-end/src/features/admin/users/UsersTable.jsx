import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import PersonService from '../../../services/personService';
import { useEffect, useState } from 'react';

const UsersTable = () => {
    const personService = new PersonService();
    const [users, setUsers] = useState([]);
    async function fetchUsers() {
        try {
            const result = await personService.getAll();
            setUsers(result.content);
        } catch (error) {
            console.log(error)
        }
    }

    const perfilTemplate = (rowData) => {
        if (!rowData.personProfile || rowData.personProfile.length === 0) return '-';
        return rowData.personProfile[0]?.profile?.type || '-';
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <DataTable value={users}>
            <Column field="id" header="ID" />
            <Column field="name" header="Nome" />
            <Column field="email" header="Email" />
            <Column body={perfilTemplate} header="Perfil" />
        </DataTable>
    )
}

export default UsersTable;