import styles from '../styles/Home.module.css'
import {ApolloClient, InMemoryCache ,gql} from "@apollo/client"
import {useState} from "react"
import {
  Heading,Box,Flex,Input,Stack,IconButton,useToast, 
} from "@chakra-ui/react";
import Chatacters from "../components/characters";
import {SearchIcon, CloseIcon} from "@chakra-ui/icons"


export async function getStaticProps(){
  const client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql/", 
    cache: new InMemoryCache(),
  });

  const {data}= await client.query({
    query: gql`
    query{
      characters(page:1){
        info{
          count
          pages
        }
        results{
          name
          id
          location{
            id
            name
          }
          origin{
            id
            name
          }
          episode{
            id
            episode
            air_date
          }
          image
        }
      }
    }    
    `
  })
  return {
    props:{
      characters: data.characters.results,
    }
  }
}

export default function Home(results) {
  const initialState = results;
  const [characters, setCharacters]= useState(initialState.characters);
  const [search, setSearch] = useState("")
  const toast = useToast();

  return (
    <>
    <head>
        <title>
          NextJs Apollo client
        </title>
    </head>
    <Flex direction="column" justify="center" align="center">
      
      <Box mb={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1"  size="2xl" mb={8}>
          Rick And Morty
        </Heading>
        <form onSubmit={async(event)=>{
          event.preventDefault();
          const results = await fetch("api/searchCharacters",{
            method:"post",
            body : search
          });
          const {characters,error} = await results.json();
          if(error){
            toast({
              position:"bottom",
              title:"error occured",
              description:error,
              duration: 5000,
              isClosable: true 
            })
          }
          else{
            setCharacters(characters);
          }
        }}>
          <Stack maxWidth="450px" width="100" align="center" isInline mb={8}>
             <Input placeholder="search"  value={search} border="none" onChange={(e)=>
            setSearch(e.target.value)}/>
             <IconButton colorScheme="blue" aria-label="search-database" icon={<SearchIcon/>} disabled={search ===""} type="submit"/>
            <IconButton colorScheme="red" aria-label="Reset-button" icon={<CloseIcon/>} disabled={search===""} onClick={
            async()=>{
              setSearch("")
              setCharacters(initialState.characters)
            }
          }/>
          </Stack>
         
        </form>
        <Chatacters characters={characters}></Chatacters>
      </Box>
    </Flex>
    </>
  )
}
