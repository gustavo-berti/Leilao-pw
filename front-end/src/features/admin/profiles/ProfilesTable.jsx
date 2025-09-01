import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import ProfileService from '../../../services/profileService';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

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

    const onRowEditComplete = (e) => {
        let _profiles = [...profiles];
        _profiles[e.index] = e.newData;
        setProfiles(_profiles);
        console.log(e.newData);
        profileService.update(e.newData);
    }

    const typeEditor = (options) => {
        return (
            <InputText
                value={options.value}
                style={{textTransform: 'uppercase'}}
                onChange={(e) => options.editorCallback(e.target.value.toUpperCase())}
            />
        )
    }

    return (
        <DataTable value={profiles} editMode='row' dataKey="id" onRowEditComplete={onRowEditComplete}>
            <Column field="id" header="ID"/>
            <Column field="type" header="Perfil" editor={typeEditor} />
            <Column rowEditor header="Editar" bodyStyle={{textAlign: 'left'}}/>
        </DataTable>
    )
}

export default ProfilesTable;