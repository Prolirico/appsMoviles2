import { Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import FormItem from "../components/controls/FormItem";
import Button from "../components/controls/Button";
import { db, app } from "../firebase-config";
import { Content, Wrapper, Header} from "../components/layout";
//import { update } from "firebase/database";

export default function Profile() {
    const [loading, setloading] = useState(false);
    const [data, setData] = useState({
        full_name: "",
        phone: "",
        age: "",
    });
    const auth = getAuth(auth);

    useEffect(() => {
        //crear la función para traer la información extra del usuario.
        const subscriber = onSnapshot(
            doc(db, "users", auth.currentUser?.uid || ""),
            (docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setData((prev) => ({
                        ...prev,
                        full_name: userData.full_name,
                        age: userData.age,
                        phone: userData.phone,
                    }));
                }
            });
        return subscriber;
    }, [auth]);


    const updateUser = async () => {
        setloading(true);
        if (auth.currentUser) {
            try {
                await setDoc(doc(db, "users", auth.currentUser.uid), data, {
                    merge: true,
                });
            } catch (error) {
                console.error(error);
                Alert.alert("Error", JSON.stringify(error));
            }
        }
        setloading(false);
    };

    return (
        <Wrapper>
            <Header title="Perfil" showBack={true} />
            <Content>
                <FormItem
                    value={data.full_name}
                    label="Nombre completo"
                    onChange={(value) =>
                        setData((prev) => ({ ...prev, full_name: value }))
                    } />
                <FormItem
                    value={data.phone}
                    label="Numero telefonico"
                    onChange={(value) =>
                        setData((prev) => ({ ...prev, phone: value }))
                    }
                />
                <FormItem
                    value={data.age}
                    label="Edad"
                    onChange={(value) =>
                        setData((prev) => ({ ...prev, age: value }))
                    }
                />
            </Content>
            <Button onPress={updateUser} label={"Actualizar"} isloading={loading}/>
        </Wrapper>
    );
}