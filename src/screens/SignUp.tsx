import { useState } from "react";
import { useNavigation } from "@react-navigation/native"
import { VStack, Image, Center, Text, Heading, ScrollView, useToast, AlertDialog, Checkbox} from "native-base";
import { useForm, Controller } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from "@hooks/useAuth";
import { api } from '@services/api';

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

import { AppError } from '@utils/AppError';

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { TouchableOpacity } from "react-native";
import React from "react";

type FormDataProps = { 
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha.').min(6," A senha deve ter pelo menos 6 dígitos."),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), null], 'A confirmação da senha não confere.'),

})

export function SignUp () {
    const [isLoading, setIsloading ] = useState(false);

    const toast = useToast();
    const {signIn} = useAuth();

    const { control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
 
    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack ();
    };

    async function handleSignUp({name, email, password}: FormDataProps){
       try {
        await api.post('/users', { name, email, password});
        await signIn(email, password);

       } catch (error) {
            setIsloading(false);

        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível criar conta. Por favor, tente mais tarde.';
         toast.show({
            title, 
            placement: 'top',
            bgColor: 'red.600',
         });
        }
       }
    
        const [isOpen, setIsOpen] = React.useState(false);

        const onClose = () => setIsOpen(false);

        const cancelRef = React.useRef(null);


    return (        
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsHorizontalScrollIndicator={false}> 
            <VStack flex={1} px={10} pb={16}>
            
                <Image 
                    source={BackgroundImg}
                    alt='Pessoas Treinando' 
                    resizeMode="contain"
                    position="absolute"
                />

                <Center my={24}>                 
                <LogoSvg />
             
                </Center>
                
                <Center>
                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                        Crie sua conta
                    </Heading>

                    <Controller 
                        control={control}
                        name="name"                        
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}                                
                            />  
                        )}                         
                    />
              
                    <Controller 
                        control={control}
                        name="email"                      
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="E-mail"
                                keyboardType="email-address"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />  
                        )}                         
                    />
                   
                  <Controller 
                        control={control}
                        name="password"                        
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="senha"
                                secureTextEntry={true}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}                                
                            />  
                        )}                         
                    />

                    <Controller 
                        control={control}
                        name="password_confirm"
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="Confirme a senha"
                                secureTextEntry={true}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password_confirm?.message}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                returnKeyLabel="send"
                                
                            />  
                        )}                         
                    />

                <VStack mt={2} mb={8}>                
                    <Center>               
                        <Center>
                            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} > 
                                <Text color="green.500" fontWeight="bold" fontSize="md" mt={4} mb={6}>
                                    Termos e condições
                                </Text>
                            </TouchableOpacity>
                        </Center>


                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                            <AlertDialog.Content>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header ><Text fontSize='md' fontWeight='bold' >Termos e Condições  </Text></AlertDialog.Header>
                                
                                <ScrollView>
                                    <AlertDialog.Body>
                                        Aviso de Privacidade do aplicativo "PERSONAL PERFEITO"

                                        1. Quais informações estão presentes neste documento?
                                        Neste Termo de Uso, o usuário do serviço Aplicativo do PERSONAL PERFEITO, encontrará informações sobre: o funcionamento do serviço e as regras aplicáveis a ele; o arcabouço legal relacionado à prestação do serviço; as responsabilidades do usuário ao utilizar o serviço; as responsabilidades da administração pública ao prover o serviço; informações para contato, caso exista alguma dúvida ou seja necessário atualizar informações; e o foro responsável por eventuais reclamações caso questões deste Termo de Uso tenham sido violadas.

                                        2. Aceitação do Termo de Uso e Política de Privacidade 
                                        Ao utilizar os serviços, o usuário confirma que leu e compreendeu os Termos e Políticas aplicáveis ao serviço Aplicativo PERSONAL PERFEITO e concorda em ficar vinculado a eles.

                                        3. Definições
                                        Para melhor compreensão deste documento, neste Termo de Uso e Política de Privacidade, consideram-se:
                                        Dado pessoal: informação relacionada a pessoa natural identificada ou identificável.
                                        Titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.
                                        Controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais.
                                        Agentes de tratamento: o controlador.
                                        Controlador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador.
                                        Tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.
                                        Uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entes privados.
                                        Sítios (sites) e aplicativos: sítios e aplicativos por meio dos quais o usuário acessa os serviços e conteúdos disponibilizados.
                                        Terceiro: Pessoa ou entidade que não participa diretamente em um contrato, em um ato jurídico ou em um negócio, ou que, para além das partes envolvidas, pode ter interesse num processo jurídico.
                                        Usuários (ou "Usuário", quando individualmente considerado): todas as pessoas naturais que utilizarem o serviço Aplicativo e site do PERSONAL PERFEITO.

                                        4. Descrição do serviço



                                        5. Agentes de tratamento
                                        5.1. A quem compete as decisões referentes ao tratamento de dados pessoais realizado no serviço Aplicativo PERSONAL PERFEITO (Controlador)?
                                        Para o serviço Aplicativo PERSONAL PERFEITO, as decisões referentes ao tratamento de dados pessoais são de responsabilidade da EMPRESA I9Ativa S.A. Endereço: Rua José do Egito n° 82  - São Raimundo das Mangabeiras - MA - CEP 65.840-000. Telefone: +55 (99) 9 84574733.
                                        6. Quais são as leis e normativos aplicáveis a esse Termo?
                                        Lei nº 12.965, de 23 de abril de 2014 - Marco Civil da Internet – Estabelece princípios, garantias, direitos e deveres para o uso da Internet no Brasil.
                                        Lei nº 12.527, de 18 de novembro de 2011 - Lei de Acesso à Informação – Regula o acesso a informações previsto na Constituição Federal.
                                        Lei nº 13.460, de 26 de junho de 2017 - Dispõe sobre participação, proteção e defesa dos direitos do usuário dos serviços públicos da administração pública.
                                        Lei nº 13.709, de 14 de agosto de 2018 - Dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural.
                                        Decreto nº 8.777, de 11 de maio de 2016 - Institui a Política de Dados Abertos do Poder Executivo federal.
                                        Decreto nº 7.724, de 16 de maio de 2012 - Regulamenta a Lei no 12.527, de 18 de novembro de 2011 (Lei de Acesso à Informação), que dispõe sobre o acesso a informações previsto na Constituição Decreto nº 10.046, de 09 de outubro de 2019 - Dispõe sobre a governança no compartilhamento de dados no âmbito da administração pública federal e institui o Cadastro Base do Cidadão e o Comitê Central de Governança de Dados.
                                        8. Quais são os direitos do usuário do serviço? 
                                        O usuário do serviço possui os seguintes direitos, conferidos pela Lei de Proteção de Dados Pessoais:
                                        - Direito de confirmação e acesso (Art. 18, I e II): é o direito do usuário de obter do serviço a confirmação de que os dados pessoais que lhe digam respeito são ou não objeto de tratamento e, se for esse o caso, o direito de acessar os seus dados pessoais.
                                        - Direito de retificação (Art. 18, III): é o direito de solicitar a correção de dados incompletos, inexatos ou desatualizados.
                                        - Direito à limitação do tratamento dos dados (Art. 18, IV): é o direito do usuário de limitar o tratamento de seus dados pessoais, podendo exigir a eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto na Lei Geral de Proteção de Dados.
                                        - Direito de oposição (Art. 18, § 2º): é o direito do usuário de, a qualquer momento, se opor ao tratamento de dados por motivos relacionados com a sua situação particular, com fundamento em uma das hipóteses de dispensa de consentimento ou em caso de descumprimento ao disposto na Lei Geral de Proteção de Dados.
                                        - Direito de não ser submetido a decisões automatizadas (Art. 20, LGPD): o titular dos dados tem direito a solicitar a revisão de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais que afetem seus interesses, incluídas as decisões destinadas a definir o seu perfil pessoal, profissional, de consumo e de crédito ou os aspectos de sua personalidade.
                                        9. Quais são as obrigações dos usuários que utilizam o serviço? 
                                        O login e senha só poderão ser utilizados pelo usuário cadastrado. Ele se compromete em manter o sigilo da senha, que é pessoal e intransferível, não sendo possível, em qualquer hipótese, a alegação de uso indevido, após o ato de compartilhamento.
                                        O Usuário é responsável pela reparação de todos e quaisquer danos, diretos ou indiretos (inclusive decorrentes de violação de quaisquer direitos de outros usuários, de terceiros, inclusive direitos de propriedade intelectual, de sigilo e de personalidade), que sejam causados à Administração Pública, a qualquer outro Usuário, ou, ainda, a qualquer terceiro, inclusive em virtude do descumprimento do disposto nestes Termos de Uso e Política de Privacidade ou de qualquer ato praticado a partir de seu acesso ao serviço.
                                        O Órgão não poderá ser responsabilizado pelos seguintes fatos:
                                        a. Equipamento infectado ou invadido por atacantes;
                                        b. Equipamento avariado no momento do consumo de serviços;
                                        c. Proteção do computador;
                                        d. Proteção das informações baseadas nos computadores dos usuários;
                                        e. Abuso de uso dos computadores dos usuários;
                                        f. Monitoração clandestina do computador dos usuários;
                                        g. Vulnerabilidades ou instabilidades existentes nos sistemas dos usuários;
                                        h. Perímetro inseguro;

                                        SOBRE A POLÍTICA DE PRIVACIDADE
                                        Esta Política de Privacidade foi elaborada em conformidade com todas as leis que abrem o assunto supracitadas acima, e nela, o usuário do serviço Aplicativo e site do PERSONAL PERFEITO encontrará informações sobre: qual o tratamento dos dados pessoais realizados, de forma automatizada ou não, e a sua finalidade; os dados pessoais dos usuários necessários para a prestação do serviço; a forma como eles são coletados; se há o compartilhamento de dados com terceiros; e quais as medidas de segurança implementadas para proteger os dados.

                                        TERMO DE AUTORIZAÇÃO PARA ENVIO DE MENSAGENS (VIA CELULAR E E-MAIL)
                                        Com a concordância deste termo, declaro que o telefone e e-mail informados são de minha propriedade e autorizo o Ministério da Cidadania a enviar mensagens por esses canais utilizando os dados e autorizações informados por mim no Aplicativo PERSONAL PERFEITO, de acordo com as seguintes condições:
                                        a. o envio de mensagens se dará somente para fins de implementação de políticas públicas e realização de estudos e pesquisas, conforme previsto no Decreto nº 11.016, de 29 de março de 2022, que regulamenta o Cadastro Único, e JAMAIS serão utilizadas para fins comerciais;
                                        b. as mensagens sempre conterão descrição clara do remetente e darão a opção de se remover imediatamente do recebimento de novas mensagens;
                                        c. as mensagens se limitarão a textos e JAMAIS conterão links, endereços de e-mail, propagandas de terceiros, arquivos anexos, solicitação de senha nem pedidos de autorização;
                                        d. o serviço de envio de mensagens será prestado por prazo indeterminado, podendo ser cancelado a qualquer tempo sem aviso prévio, sem prejuízo para minha pessoa ou ainda para a Empresa I9Ativa S.A. a e os seus operadores;
                                        e. a I9Ativa S.A. e os seus operadores não se responsabilizam por problemas nos serviços de celular e e-mail nem por acessos de outras pessoas às mensagens recebidas por mim;
                                        f. as dúvidas sobre o envio de mensagens podem ser esclarecidas pela Central de Atendimento da I9Ativa S.A. , pelo telefone +5599984574733 ou por meio eletrônico: pablomartins1515@gmail.com


                                    </AlertDialog.Body>
                                    <AlertDialog.Footer> 

                                            <Center mb={1} mt={1} >
                                                <Checkbox value={""} mb={4} 
                                                                                    >
                                                        <Text color='green.500'>
                                                            Eu li e aceito os termos e condições.
                                                        </Text>
                                                </Checkbox> 
                                                
                                                <Button size={4} variant="outline" colorScheme="coolGray" onPress={onClose} title={"Confirmar"}>
                                                    Aceito os Termos 
                                                </Button>
                                            </Center>                           
                                    
                                    </AlertDialog.Footer>
                                </ScrollView>                                   
                                <AlertDialog.Footer>                            
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                    </Center>                       

                    <Center>                        
                        <Checkbox value={""}>
                                    <Text color='white'>
                                        Eu li e aceito os termos e condições.
                                    </Text>
                        </Checkbox>                                                           
                    </Center>                                      
                </VStack> 

                    <Button title="Criar e acessar"
                            onPress={handleSubmit(handleSignUp)}
                            isLoading={ isLoading }
                            />
                </Center>           

               
                <Button 
                    title="Voltar para o login" 
                    variant={"outline"} 
                    mt={24}
                    onPress={handleGoBack} 
                />               
            
               
            </VStack>
        </ScrollView>            
    );
}