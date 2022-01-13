import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        task: '',
        done: false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks()
  }
  handleChange(e) {
    var value = e.target.value

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        task: value,
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    var csrftoken = this.getCookie('csrftoken');
    var url = 'https://muhammedmardood.pythonanywhere.com/api/task-list/'

    if (this.state.editing) {
      var url = `https://muhammedmardood.pythonanywhere.com/api/task/${this.state.activeItem.id}/`
      this.setState({
        editing: false
      })
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem: {
          id: null,
          task: '',
          done: false,
        }
      })
    }).catch(function (error) {
      console.log(error)
    })
  }

  fetchTasks() {
    fetch('https://muhammedmardood.pythonanywhere.com/api/task-list/').then(
      response => response.json()
    ).then(data =>
      this.setState(
        { todoList: data }
      )
    )
  }

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true
    })
  }

  deleteTask(task) {
    var csrftoken = this.getCookie('csrftoken');
    var url = `https://muhammedmardood.pythonanywhere.com/api/task/delete/${task.id}/`

    fetch(url, {
      method: 'DELETE',
      headers: {
        "Content-type": 'application/json',
        'X-CSRFToken': csrftoken,
      },
    }).then((response) => {
      this.fetchTasks()
    })
  }

  strikeUnstrike(task) {
    task.done = !task.done
    var csrftoken = this.getCookie('csrftoken');
    var url = `https://muhammedmardood.pythonanywhere.com/api/task/${task.id}/`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'done': task.done, 'task': task.task })
    }).then(() => {
      this.fetchTasks()
    })
  }
  render() {
    var tasks = this.state.todoList
    var self = this

    return (
      <div className='container'>
        <div id='task-container'>
          <div id='form-wrapper'>
            <form onSubmit={this.handleSubmit} id='form'>
              <div className='flex-wrapper'>
                <div style={{ flex: 6 }}>
                  <input onChange={this.handleChange} value={this.state.activeItem.task} className='form-control' type='text' name='title' id='title' placeholder='Add a task' />
                </div>
                <div style={{ flex: 1 }}>
                  <input id='submit' className='btn btn-warning' type="submit" name='add' />
                </div>
              </div>
            </form>
          </div>
          <div id='list-wrapper'>
            {tasks.map(function (task, index) {
              return (
                <div key={index} className='task-wrapper flex-wrapper'>
                  <div onClick={() => self.strikeUnstrike(task)} style={{ flex: 7 }}>
                    {!task.done ? <span>{task.task}</span> : <strike>{task.task}</strike>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => self.deleteTask(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
export default App;
