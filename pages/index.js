import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import {useRouter} from 'next/router'
import appConfig from '../config.json';
import { DiReact } from "react-icons/di";

//Componente React
//Função recebe um argumento/propriedade


function Titulo(props){
  console.log(props);
  const Tag = props.tag;
  return (
      <>
      <Tag>{props.children}</Tag>
          <style jsx>{`
              ${Tag} {
                  color: ${appConfig.theme.colors.neutrals['000']};
                  font-size: 20px;
                  font-weight:600;
              }    
          `}</style>
      </>
  );
}

export default function PaginaInicial() {  
  const [username, setUsername] = React.useState('');
  const roteamento = useRouter();
  const imageStart = '/img/yamatoGIF.gif';

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: 'url(/staryamato.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (infosDoEvento){
              infosDoEvento.preventDefault();
              console.log('Alguém submeteu o form');
              roteamento.push(`/chat?username=${username}`);
            }}
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Titulo tag="h2">Que bom que você voltou!</Titulo>
            <Text variant="body2" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals['000'] }}>
              {< DiReact />} {appConfig.name}

            </Text>

            <TextField
              placeholder="Informe o seu login no GitHub"
              value={username}
              onChange={function (event) {
                console.log('usuário digitou ', event.target.value);
                // Onde está o valor?
                const valor = event.target.value;
                // trocando o valor da variável através do React 
                setUsername(valor);
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.button.buttonBlue,
                  backgroundColor: appConfig.theme.colors.background.fundoBlack,
                },
              }}
            /> 
            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.button.buttonBlue,
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.button.buttonBlack,                
              }}
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '250px',
              padding: '16px',
              flex: 1,
              minHeight: '240px',              
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
                boxShadow: '0 0 15px 0 #000',
              }}

              onError={function (event) {
                event.target.src = imagemInicial
              }}

              src={username.length > 2 ? `https://github.com/${username}.png` : imageStart}
            />

            <a
              href={`https://github.com/${username}`}
              target={'_blank'}
            >

              <Text
                variant="body3"
                styleSheet={{
                  color: appConfig.theme.colors.neutrals['000'],
                  fontSize: '16px',
                  padding: '3px 10px',                  
                }}
              >
                {username}
              </Text>
            </a>

          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}