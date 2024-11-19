import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Todo from './Todo';
import {
  Paper,
  List,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Button,
  Link,
  Dialog,
  DialogTitle, DialogContent, TextField, DialogActions
} from "@mui/material"
import AddTodo from './AddTodo';
import {call, signout} from "./service/ApiService";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      open: false,
      friendId: '',
      editingTodoId: null,

    };
  }

  setEditingTodo = (id) => {
    this.setState({ editingTodoId: id });
  };

  resetEditingTodo = (id) => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) => {
        if (item.id === id) {
          return { ...item, title: prevState.items.find((i) => i.id === id).title };
        }
        return item;
      }),
    }));
  };

  componentDidMount() {
    call("/todo", "GET", null).then((response) => {
      this.setState({items: response.data, loading: false})
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, friendId: '' }); // 모달 닫을 때 friendId도 초기화
  };

  handleFriendIdChange = (event) => {
    this.setState({ friendId: event.target.value });
  };

  handleSubmit = () => {
    // 친구 초대 로직 추가 (예: API 호출 등)
    console.log('친구 ID:', this.state.friendId);
    this.handleClose(); // 모달 닫기
  };

  add = (item) => {
    call("/todo", "POST", item).then((resposne) => {
      this.setState({items: resposne.data})
    });
  }

  delete = (item) => {
    call("/todo", "DELETE", item).then((response) => {
      this.setState({items: response.data})
    });
  }
  update = (item) => {
    call("/todo", "PUT", item).then((response) => {
      this.setState({items: response.data})
    });
  }

  render() {
    var todoItems = this.state.items.length > 0 && (
        <Paper style={{margin: 16}}>
          <List>
            {this.state.items.map((item, idx) => (
                <Todo item={item} key={item.id} delete={this.delete} update={this.update}
                      isEditing={this.state.editingTodoId === item.id}
                      setEditingTodo={this.setEditingTodo}
                      resetEditingTodo={this.resetEditingTodo}/>
            ))}
          </List>
        </Paper>
    );
    var navigationBar = (
        <AppBar position={"static"}>
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Link href={"/"} color="inherit" variant={"h6"} underline={"none"}>오늘의 할일</Link>
                <Button color="inherit" variant={"h6"} underline={"none"} onClick={this.handleClickOpen}>친구 초대</Button>
              </Grid>
              <Grid item>
                <Button color={"inherit"} onClick={signout}>
                  로그아웃
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
    );

    var addFriends = (
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>친구 초대</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="친구 ID"
                type="text"
                fullWidth
                variant="outlined"
                value={this.state.friendId}
                onChange={this.handleFriendIdChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              취소
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              초대
            </Button>
          </DialogActions>
        </Dialog>
    );

    var todoListPage = (
        <div>
          {navigationBar}
          <Container maxWidth="md">
            <AddTodo add={this.add}/>
            <div className="TodoList">{todoItems}</div>
          </Container>
          {addFriends}
        </div>);

    var loadingPage = <h1>로딩중...</h1>;

    var content = this.state.loading ? loadingPage : todoListPage;

    return (
        <div className="App">
          {content}
        </div>
    );
  }
}

export default App;
