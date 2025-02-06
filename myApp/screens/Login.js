import { Content, Header, Wrapper, Title } from '../components/layout';
import Button from '../components/controls/Button';
import FormItem from '../components/controls/FormItem';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';

export default function Login({ navigation }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  useEffect(() => {
    //metodo para suscribirse cuando el usuario inicia sesion
    const subscriber=onAuthStateChanged(auth, response=>{
      if (response){
        navigation.navigate("Dashboard");
      }
    });
    return subscriber;
  }, [auth]);
// Eventos para login, cambio de usuario
const login = async() =>{
  if(user && pass){
    await loginWithEmailPass(user, pass);
  }
};
const onChangeUser = (value) =>{
  setUser(value);
};
// Eventos para password
const onChangePass = (value) =>{
  setPass(value);
};

  return (
    <Wrapper>
      <Header showBack={true} showCart={false} />
      <Content>
        <Title title="Estoy listo para comprar." />
        <FormItem label="Nombre de usuario" onChange={onChangeUser}></FormItem>
        <FormItem label="Contraseña" onChange={onChangePass}></FormItem>
        <Button label="ACCEDER" onPress={login} />
      </Content>
    </Wrapper>
  );
};
