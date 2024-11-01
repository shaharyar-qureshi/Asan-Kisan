import React, { Component,useState  } from 'react';
import {
    StyleSheet,
  Alert,
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  } from "react-native";
  
  import { db } from "../Firebase";
  import CheckBox from "react-native-check-box";
  import Firebase from "../Firebase";
  import Icon from "react-native-vector-icons/Ionicons";
 
  
  
  
  
  
  
  
  
  
  export default class Notifications extends Component {
    constructor() {
        super();
        this.state = {
          todos: {},
          presentToDo2: "",
        };
    
        this.addNewTodo = this.addNewTodo.bind(this);
        this.clearTodos = this.clearTodos.bind(this);
      }
      componentDidMount() {
        db.ref("/Notifications").on("value", (querySnapShot) => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
    
          let todoItems = { ...data };
          console.log(data);
          this.setState({
            todos: todoItems,
          });
        });
      }
      addNewTodo() {
        db.ref("/Notifications").push({
          done: false,
          todoItem: this.state.presentToDo2,
        });
        Alert.alert("Congrats!", "Notifications has been sent");
        this.setState({
          presentToDo: "",
        });
      }
    
      clearTodos() {
        db.ref("/Notifications").remove();
      }    


// viewAllUsers(){
//     admin.auth()
//   .getUser(uid)
//   .then((userRecord) => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log("Hello");
//     console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
//   })
//   .catch((error) => {
//     console.log('Error fetching user data:', error);
//   });
// }
    
      render(){
        let todosKeys = Object.keys(this.state.todos);
        return (
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainerStyle}
            >
            
              {/* <TextInput
                placeholder="Add new Todo"
                value={this.state.presentToDo}
                style={styles.textInput}
                onChangeText={e => {
                  this.setState({
                    presentToDo2: e,
                  });
                }}
                onSubmitEditing={this.addNewTodo}
               
              /> */}
              <View>
                {todosKeys.length > 0 ? (
                  todosKeys.map((key) => (
                    <ToDoItem
                      key={key}
                      id={key}
                      todoItem={this.state.todos[key]}
                      funcs={this.playAudio}
                    />
                  ))
                ) : (
                  <Text>No new notification</Text>
                )}
              </View>
              
              
            </ScrollView>
          );
        }
      }
      
      const ToDoItem = ({ todoItem: { todoItem: name, done }, id, funcs }) => {
        const [doneState, setDone] = useState(done);
      
        const onCheck = () => {
          setDone(!doneState);
          db.ref("/Notifications").update({
            [id]: {
              todoItem: name,
              done: !doneState,
              user: Firebase.getUid(),
            },
          });
        };
        return (
          <View style={styles.todoItem}>
            <View style={{
  height: 32,
  width: 32,
  borderRadius: 30,
  backgroundColor:"#fff",
  justifyContent:"center",
  alignItems:"center"
}}>
 <Icon name={"md-notifications"} size={28} color={"#f0a500"} />
            </View>
            
          
            <Text style={[styles.todoText, { opacity: doneState ? 0.2 : 1 }]}>
              {name}
            </Text>
            <TouchableOpacity
              style={{ height: 20, width: 40 }}
              onPress={() => funcs(name)}
            >
             
            </TouchableOpacity>
            
      
           
          </View>
        );
  }
  const styles = StyleSheet.create({
    btnContainer: {
      flexDirection: "row",
    },
    container: {
      flex: 1,
      backgroundColor: "#3d7ea6",
    },
    contentContainerStyle: {
      alignItems: "center",
    },
  
    textInput: {
      borderWidth: 1,
      borderColor: "#afafaf",
      width: "80%",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 20,
      fontSize: 20,
    },
    todoItem: {
      flexDirection: "row",
     left:15,
     marginVertical:2,
      alignItems: "center"
    },
    todoText: {
      borderColor: "#1f3c88",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderWidth: 1,
      borderRadius: 10,
      marginRight: 2,
      minWidth: "80%",
      
      marginLeft:10,
      backgroundColor:"#fff"
    },
    Stepbtn: {
      marginTop: 5,
      padding: 20,
      width: "40%",
      borderRadius: 10,
      backgroundColor: "brown",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "space-between",
      margin: 10,
    },
    containerOK: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    mainHeadings: {
      fontSize: 18,
      // margin:10,
      fontWeight: "bold",
    },
  });
  