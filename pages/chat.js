import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { BiSend } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md';
import { BiCool } from "react-icons/bi";
import { RiDeleteBinLine } from 'react-icons/ri';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { createClient } from '@supabase/supabase-js'

// const SUPABASE_ANON_KEY = ''
// const SUPABASE_URL = ''


const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


function listeningToTheMessageOnRealTime(messageadd){
    return supabaseClient
    .from('messageChat')
    .on('INSERT', (responseaLive) => {
        messageadd(responseaLive.new);
        
    })
    .subscribe();     
};

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listMens, setListMens] = React.useState([
        
    ]);    

    const roteamento = useRouter();
    const userLogin = roteamento.query.username;

    React.useEffect(() => {
        supabaseClient
            .from('messageChat')
            .select('*')
            .order('id', { ascending: false})
            .then(( {data}) => {
                console.log('Dados da consulta: ', data);
                setListMens(data);
            });          
            listeningToTheMessageOnRealTime((newMes) => {
                console.log('New Message: ', newMes);
                if(userLogin != newMes.from ){
                    let audio = new Audio(appConfig.sound);
                    audio.play();
                }
                setListMens((valueCurrentList)=>{
                    return[
                        newMes,
                        ...valueCurrentList,
                    ]
                });
            });
    }, []);

    function handleNewMessage(newMes) {
        const sendMens = {            
            from: userLogin,                   
            textmsg: newMes,
        };

        supabaseClient
            .from('messageChat')
            .insert([                
                sendMens
            ])
            .then(({data} ) => {
                console.log('Creating message: ', data);
            })

        setMensagem('');
    }

    function Header() {
        return (
            <>
                <Box styleSheet={{ width: '100%', display: 'flex',  alignItems: 'center', justifyContent: 'space-between' }} >
                    <Text variant='heading5'>
                       ChatInspDiscord { < BiCool />}  CHAT
                    </Text>
                    <Button
                        variant='tertiary'
                        label={< MdLogout size={18}  />}
                        href="/"
                        styleSheet={{
                            borderRadius: '5px',
                            minWidth: '42px',
                            minHeight: '42px',
                            backgroundColor: appConfig.theme.colors.button.buttonBlack,
                            marginRight: '10px',
                            color: appConfig.theme.colors.neutrals[200],
                            hover: {
                                backgroundColor: appConfig.theme.colors.button.buttonBlue,
                                color: 'black'
                            }
                        }}
                        buttonColors={{
                            mainColorLight: appConfig.theme.colors.button.buttonBlue,
                            
                        }}

                    />
                </Box>
            </>
        )
    }    

    return (
        //Background Imagem
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(/img/staryamato.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >

            <Box
                // Background transparente
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.background.fundoBlack1,
                    height: '100%',
                    maxWidth: {
                        md: '70%',
                        sm: '95%',
                        xs: '95%',
                    },
                    maxHeight: '93vh',
                    padding: {
                        md: '40px',
                        sm: '20px',
                        xs: '20px',
                    },
                    padding: '32px',
                }}
            >

                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listMens} />

                    <Box
                        /* Message array */
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    console.log(event);
                                    handleNewMessage(mensagem);
                                }
                            }}

                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                height: '40px',
                                padding: '10px',
                                resize: 'none',
                                borderRadius: '2px',
                                border: '1px solid #000000',
                                backgroundColor: appConfig.theme.colors.background.fundoBlack1,
                                color: appConfig.theme.colors.neutrals[200]
                            }}
                        />
                        {/* CallBack */}
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                console.log('Salva esse sticker no banco', sticker);
                                handleNewMessage(':sticker: ' + sticker);
                            }}
                        />  


                        <Button
                            variant='tertiary'
                            label={< BiSend size={23} />}
                            type='submit'
                            styleSheet={{
                                position: 'absolute',
                                marginBottom: '6px',
                                right: '60px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                            buttonColors={{
                                mainColorLight: 'none',
                            }}

                            onClick={(event) => {
                                event.preventDefault();
                                if (mensagem.length > 0) {
                                    handleNewMessage(mensagem);
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )

    // Photo, name and date from message
    function MessageList(props) {
        console.log('CONTEUDO DA PROPS: ', props);
        return (
            <Box
                tag="ul"
                styleSheet={{
                    overflowY: 'scroll',
                    wordBreak: 'break-word',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    flex: 1,
                    color: appConfig.theme.colors.neutrals["000"],
                    marginBottom: '1px'
                }}

            >
                {props.mensagens.map((newMessage) => {
                    return (
                        //message
                        <Text
                            key={newMessage.id}
                            tag="li"
                            styleSheet={{
                                borderRadius: '5px',
                                padding: '6px',
                                marginBottom: '5px',
                                wordWrap: 'word-brek',
                                hover: {
                                    backgroundColor: appConfig.theme.colors.background.fundoBlue,
                                    marginRight: '10px'
                                }
                            }}
                        >
                            <Box
                                styleSheet={{
                                    marginBottom: '3px',
                                    width: '100%',
                                    marginBottom: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box>
                                    <Image
                                        //User Photo
                                        styleSheet={{
                                            width: '25px',
                                            height: '25px',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                            marginRight: '5px'
                                        }}
                                        onError={(event) => {
                                            event.target.src = appConfig.userImageDefault
                                        }}
                                        src={`https://github.com/${newMessage.from}.png`}
                                    />

                                    <Text tag="strong"
                                    //User Name
                                    >
                                        {newMessage.from}
                                    </Text>
                                    <Text
                                        //Message Date
                                        styleSheet={{
                                            fontSize: '10px',
                                            marginLeft: '8px',
                                            color: appConfig.theme.colors.neutrals[300],
                                        }}
                                        tag="span"
                                    >
                                        {(new Date().toLocaleDateString())}
                                    </Text>
                                </Box>

                                {userLogin === newMessage.from ?
                                    <Box
                                        title={`Excluir mensagem`}
                                        styleSheet={{
                                            padding: '2px 15px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {

                                            let resposta = confirm('Confirmar exclussão?')
                                            if (resposta === true) {
                                                supabaseClient
                                                    .from('messageChat')
                                                    .delete()
                                                    .match({ id: newMessage.id }).then(() => {
                                                        let indice = listMens.indexOf(mensagem);
                                                        //1 Param: Indice que vou manipular 
                                                        //2 Param: Quantidade de itens que seram manipulados a partir do primeiro paramentro 
                                                        //3 Param: Setar oq vc vai colocar no lugar (não obrigatório)
                                                        listMens.splice(indice, 1)
                                                        //... juntar um objeto/array com o outro
                                                        setListMens([...listMens])
                                                    })
                                            }
                                        }}
                                    >
                                        {<RiDeleteBinLine />}
                                    </Box>
                                    :
                                    null}
                            </Box>
                            
                            {/* Declarativo */}
                            {/* {mensagem.textmsg.startsWith(':sticker:').toString()} */}
                            {newMessage.textmsg.startsWith(':sticker:') ?
                                (
                                    <Image src={newMessage.textmsg.replace(':sticker:', '')}
                                        styleSheet={{
                                            width: '150px',
                                        }}
                                    />
                                ) : (
                                    newMessage.textmsg
                                )}

                        </Text>
                    );
                })}

            </Box>
        )
    }

}