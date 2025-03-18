import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, QuerySnapshot } from 'firebase/firestore';
import { View, Text, Alert, FlatList, ScrollView } from 'react-native';
import { Content, Header, Wrapper } from '../components/layout';
import { auth, db } from "../firebase-config";
import { logoutAuth } from "../services/firebase";
import State from '../components/controls/State';
import Base from '../components/modals/Base';
import FormItem from '../components/controls/FormItem';
import Button from '../components/controls/Button';
import StateModal from '../components/modals/StateModal';
import { Picker } from '@react-native-picker/picker'; // Importa el Picker



export default function Home({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState({
        key: "",
        name: "",
        code: "",
        status: false,
    });

    const [data, setData] = useState([]);
    const [status, setStatus] = useState("Activo"); // Estado para el estatus
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        const subscriber = onSnapshot(
            query(collection(db, "states"), orderBy("name")),
            (querySnapshot) => {
                const states = [];
                querySnapshot.forEach((doc) => {
                    states.push({
                        ...doc.data(),
                        key: doc.id,
                    });
                });
                setData(states);
            });
        return subscriber;
    }, []);

    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, (response) => {
            if (!response) {
                navigation.navigate("Login");
            }
        });
        return subscriber;
    }, [auth]);

    const logout = async () => {
        await logoutAuth();
    };

    const createNew = () => {
        setSelected({
            key: "",
            name: "",
            code: "",
            status: false,
        });
        toggleModal();
    };

    const editState = (item) => {

        setSelected(item);
        setStatus(item.status ? "Activo" : "Inactivo");
        toggleModal();

    };
    const deleteState = async (key) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que quieres eliminar este elemento?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            const stateRef = doc(db, "states", key);
                            await deleteDoc(stateRef);
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        )
    };

    const toggleModal = () => {
        setVisible(!visible);
    };

    const handleSelect = (value) => {
        setSelectedState(value);
    };

    return (
        <Wrapper>
            <Header title="Dashboard" />
            <Content>
                {visible && (
                    <Base
                        id="modal-state"
                        visible={visible}
                        title={"Editar estado"}
                        onClose={toggleModal}
                    >
                        <FormItem label="Nombre" />
                        <FormItem label="Código" />
                        <Text>Estatus</Text>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Activo" value="Activo" />
                            <Picker.Item label="Inactivo" value="Inactivo" />
                        </Picker>
                    </Base>
                )}
                <Button label="Cerrar sesión" onPress={logout} />
                <Button label="Abrir modal" onPress={toggleModal} />
                <ScrollView horizontal={true}>
                    <FlatList
                        data={data}
                        renderItem={State}
                        keyExtractor={item => item.id}
                    />
                </ScrollView>
            </Content>
        </Wrapper>
    );
};


