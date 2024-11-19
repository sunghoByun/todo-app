import React from "react";
import Todo from "./Todo"; // 각 Todo를 관리하는 컴포넌트

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: props.todos, // Todo 리스트
            editingTodoId: null, // 현재 편집 중인 Todo의 id
        };
    }

    handleEditMode = (todoId) => {
        this.setState({ editingTodoId: todoId });
    };

    handleUpdate = (updatedItem) => {
        const updatedTodos = this.state.todos.map((todo) =>
            todo.id === updatedItem.id ? updatedItem : todo
        );
        this.setState({ todos: updatedTodos, editingTodoId: null });
    };

    handleDelete = (item) => {
        const updatedTodos = this.state.todos.filter((todo) => todo.id !== item.id);
        this.setState({ todos: updatedTodos });
    };

    render() {
        return (
            <div>
                {this.state.todos.map((todo) => (
                    <Todo
                        key={todo.id}
                        item={todo}
                        isEditing={this.state.editingTodoId === todo.id}
                        setEditing={this.handleEditMode}
                        update={this.handleUpdate}
                        delete={this.handleDelete}
                    />
                ))}
            </div>
        );
    }
}

export default TodoList;
