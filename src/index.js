import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import parseISO from 'date-fns/parseISO';

const domStuff = (function() {
    //nav stuff
    const navProjects = document.getElementById("projects");
    const navDeleteBtns = document.getElementsByClassName("nav-delete-button");
    const navAddProj = document.getElementById("nav-submit-hidden-btn");
    const addProjNameField = document.getElementById("add-project-field");
    const navAddProjForm = document.getElementById("nav-add-project");
    const navProjectNames = document.getElementsByClassName("project-name");

    //main content page
    const projectListContainer = document.getElementById("project-content");
    const projectUL = document.getElementById("project-items");
    const projectContentHeader = document.getElementById("project-main-header");
    const taskDeleteBtns = document.getElementsByClassName("task-delete-button");
    const todoTask = document.getElementsByClassName('task-item');
    const todoTaskTitle = document.getElementsByClassName('task-title');
    const todoTaskInfos = document.getElementsByClassName('info');
    const editTaskInfo = document.getElementsByClassName('edit-task');
    for (let i = 0; i < todoTaskInfos.length; i++) {
        todoTaskInfos[i].style.display = 'none';
    }

    // adding task to project
    const addTaskForm = document.getElementById("add-task-background-cover");
    const taskForm = document.getElementById("add-task-form");
    const newTaskName = document.getElementById("add-task-field");
    const priorityBtns = taskForm.querySelectorAll('input[type="radio"]');
    const addTaskBtn = document.getElementById("add-task-button");
    const addToDoLi = document.getElementById("todo-add-li");
    addTaskForm.style.display = 'none';
    const checkboxBtns = document.getElementsByTagName('span');
    const dateInput = taskForm.querySelector('input[type="date"]');
    const infoInput = document.querySelector('#info-form-field');

    // editing task 
    const editTaskFormCover = document.getElementById("edit-task-background-cover");
    const editTaskForm = document.getElementById("edit-task-form");
    const editName = document.getElementById("edit-task-field");
    const editPriorityBtns = editTaskForm.querySelectorAll('input[type="radio"]');
    const editDate = editTaskForm.querySelector('input[type="date"]');
    const editInfo = document.getElementById("edit-info-field");
    const editTaskBtns = document.getElementsByClassName("edit-task");
    const confirmEditBtn = document.getElementById('edit-task-button');
    const cancelEditBtn = document.getElementById('cancel-edit-button');
    let taskToEditArr = [];

    const openTaskForm = function() {
        addTaskForm.style.display = 'block';
        let currentDate = dateStuff.currentDate();
        dateStuff.setMinDate(currentDate);
    }

    const closeTaskForm = function() {
        addTaskForm.style.display = 'none';
    }

    const showHideTaskInfo = function(e) {
        let titleDiv = e.target.parentNode;
        let chosenLi = titleDiv.parentNode;
        let infoDiv = chosenLi.children[1];
        if (infoDiv.style.display == 'none') {
            infoDiv.style.display = 'block';
        } else if (infoDiv.style.display == 'block') {
            infoDiv.style.display = 'none';
        }
    }

    const openEditTaskForm = function(e) {
        editTaskFormCover.style.display = 'block';
        let taskToEdit = (e.target.parentNode).parentNode;
        taskToEditArr[0] = taskToEdit;
        let currentDate = dateStuff.currentDate();
        editDate.setAttribute('min', currentDate);
    }

    const closeEditTaskForm = function(e) {
        editTaskFormCover.style.display = 'none';
        editTaskForm.reset();
    }

    return { navProjects, navDeleteBtns, navAddProj, addProjNameField, navAddProjForm, navProjectNames, projectListContainer,
            projectUL, projectContentHeader, addTaskForm, addTaskBtn, newTaskName, openTaskForm, closeTaskForm, addToDoLi, 
            taskDeleteBtns, priorityBtns, checkboxBtns, dateInput, infoInput, todoTaskInfos, showHideTaskInfo, todoTask, 
            todoTaskTitle, editTaskInfo, taskForm, editTaskForm, editTaskFormCover, editName, editPriorityBtns,
            editDate, editInfo, editTaskBtns, openEditTaskForm, confirmEditBtn, cancelEditBtn, closeEditTaskForm, 
            taskToEditArr };
})();

const holdingProjects = (function() {
    const projectHolderArr = [
        {name: "General", 
        items: []}, 
        {name: "Shopping", items: []}];
    return { projectHolderArr }
})();

const ProjectObject = function(title) {
    const storeProj = () => {
        holdingProjects.projectHolderArr.push({name: title, items: []});
    }
    return { storeProj };
}

const delProj = (function() {
    const deleteProj = function(e) {
        let divToRemove = e.target.parentNode;
        let removedDivTitle = divToRemove.children[1].textContent;
        domStuff.navProjects.removeChild(divToRemove);
        for (let i = 0; i < holdingProjects.projectHolderArr.length; i++) {
            if (holdingProjects.projectHolderArr[i].name == removedDivTitle) {
                holdingProjects.projectHolderArr.splice(i, 1);
                break;
            }
        }
        localStorage.setItem('Projects', JSON.stringify(holdingProjects.projectHolderArr));
    }
    return { deleteProj }
})();

const dateStuff = (function() {

    const currentDate = function() {
        let dateObj = new Date();
        let dateMonth = dateObj.getUTCMonth() + 1;
        if (dateMonth < 10) { dateMonth = '0' + dateMonth.toString(); }
        let dateDay = dateObj.getUTCDate();
        if (dateDay < 10) { dateDay = '0' + dateDay.toString(); }
        let dateYear = dateObj.getUTCFullYear();
        let newDate = `${dateYear}-${dateMonth}-${dateDay}`;
        return newDate;
    }
    const setMinDate = function(todayDate) {
        domStuff.dateInput.setAttribute('min', todayDate);
    }
    const setTaskDate = function(date, listItem) {
        const timeDOM = listItem.querySelector('time');
        let parseDate = parseISO(date);
        let timeRemaining = formatDistanceToNowStrict(parseDate);
        timeDOM.innerHTML = '<em>' + timeRemaining + '</em>';
    }

    return { currentDate, setMinDate, setTaskDate }
})();

const switchProj = (function() {
    const changeProjPage = function(e) {
        let oldUL = document.querySelector('ul');
        let projPageTitle = e.target.textContent;
        domStuff.projectContentHeader.textContent = projPageTitle;
        (domStuff.projectListContainer).removeChild(oldUL);
        let newUL = document.createElement('ul');
        newUL.id = 'project-items';
        for (let i = 0; i < holdingProjects.projectHolderArr.length; i++) {
            if (holdingProjects.projectHolderArr[i].name == projPageTitle) {
                for (let j = 0; j < holdingProjects.projectHolderArr[i].items.length; j++) {
                    let listItem = holdingProjects.projectHolderArr[i].items[j][0];
                    let newLi = document.createElement('li');
                    let description = holdingProjects.projectHolderArr[i].items[j][3];
                    let titleDiv = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    titleDiv.innerHTML = '<span class="checkbox"></span> <p>' + listItem + 
                                            '</p> <time> <em> Tomorrow </em></time>' + 
                                            '<img src="https://image.flaticon.com/icons/svg/458/458594.svg" class="task-delete-button">';
                    infoDiv.innerHTML = '<p>' + description + '</p>' +
                                        '<img src="https://image.flaticon.com/icons/svg/526/526127.svg" class="edit-task">';
                    newUL.appendChild(newLi);
                    newLi.appendChild(titleDiv);
                    newLi.appendChild(infoDiv);
                    let span = titleDiv.querySelector('span');
                    span.classList.add(holdingProjects.projectHolderArr[i].items[j][1]);
                    titleDiv.classList.add('task-item');
                    infoDiv.classList.add('info');
                    titleDiv.children[3].addEventListener('click', delTask.deleteTask);
                    infoDiv.style.display = 'none';
                    let titleP = titleDiv.querySelector('p');
                    titleP.classList.add('task-title');
                    titleP.addEventListener('click', domStuff.showHideTaskInfo);
                    let date = holdingProjects.projectHolderArr[i].items[j][2];
                    dateStuff.setTaskDate(date, newLi);
                    span.addEventListener('click', checked.checkedTask);
                }
            }
        }
        newUL.appendChild(domStuff.addToDoLi);
        (domStuff.projectListContainer).appendChild(newUL);
        domStuff.projectUL = newUL;
    }
    return { changeProjPage }
})();

const addProj = (function() {
    const makeNewProj = function(e) {
        e.preventDefault();
        let newProjName = (domStuff.addProjNameField).value;
        domStuff.navAddProjForm.reset();
        let newProj = document.createElement('div');
        newProj.className = 'project';
        newProj.innerHTML = '<img class="bullet-point" src="https://image.flaticon.com/icons/png/512/148/148895.png">' +
                            '<p class="project-name">' + newProjName + '</p>' +
                            '<img src="https://image.flaticon.com/icons/svg/216/216658.svg" class="nav-delete-button">';
        (domStuff.navProjects).appendChild(newProj);
        let newProjItem = ProjectObject(newProjName);
        newProjItem.storeProj();
        newProj.children[2].addEventListener('click', delProj.deleteProj);
        newProj.children[1].addEventListener('click', switchProj.changeProjPage);
        localStorage.setItem('Projects', JSON.stringify(holdingProjects.projectHolderArr));
    }

    return { makeNewProj }
})();

const delTaskBackground = (function() {
    const deleteTaskFunc = function(taskTitle) {
        for (let i = 0; i < (holdingProjects.projectHolderArr).length; i++) {
            if (holdingProjects.projectHolderArr[i].name == domStuff.projectContentHeader.textContent) {
                for (let j = 0; j < (holdingProjects.projectHolderArr[i].items).length; j++) {
                    if ((holdingProjects.projectHolderArr[i]).items[j][0] == taskTitle) {
                       (holdingProjects.projectHolderArr[i].items).splice(j, 1);
                    }
                }
            }
        }
        localStorage.setItem('Projects', JSON.stringify(holdingProjects.projectHolderArr));
    }
    return { deleteTaskFunc };
})();

const delTask = (function() {
    const deleteTask = function(e) {
        let divOfTitle = e.target.parentNode;
        let taskToRemove = divOfTitle.parentNode;
        let removedTaskTitle = divOfTitle.children[1].textContent;
        domStuff.projectUL.removeChild(taskToRemove);
        delTaskBackground.deleteTaskFunc(removedTaskTitle);
    }

    return { deleteTask }
})();

const choosePrior = (function() {
    const choosePriority = function() {
        let priorityChoice;
        domStuff.priorityBtns.forEach(function(btn) {
            if (btn.checked) {
                priorityChoice = btn.value;
            }
        });
        return priorityChoice;
    }
    return { choosePriority };
})();

const checked = (function() {
    const checkedTask = function(e) {
        let titleDiv = e.target.parentNode;
        let task = titleDiv.parentNode;
        let span = task.querySelector('span');
        span.style.backgroundColor = '#111E26';
        task.style.opacity = '60%';
        let taskHead = task.children[1].textContent;
        setTimeout(() => {
            delTaskBackground.deleteTaskFunc(taskHead);
            domStuff.projectUL.removeChild(task);
        }, 2300);
    }
    return { checkedTask }
})();

const addTask = (function() {
    const addTasktoList = function(e) {
        e.preventDefault();
        let newTask = (domStuff.newTaskName).value;
        domStuff.closeTaskForm();
        let priorClass = choosePrior.choosePriority();;
        let taskDesc = (domStuff.infoInput).value;
        let dateAdded = (domStuff.dateInput).value;
        domStuff.taskForm.reset();
        let newLi = document.createElement('li');
        let titleDiv = document.createElement('div');
        let infoDiv = document.createElement('div');
        titleDiv.innerHTML = '<span class="checkbox"></span> <p>' + newTask + '</p>' +
                                '<time> <em> Tomorrow </em></time>' +  
                                '<img src="https://image.flaticon.com/icons/svg/458/458594.svg" class="task-delete-button">';
        titleDiv.classList.add('task-item');
        infoDiv.classList.add('info');
        infoDiv.innerHTML = '<p>' + taskDesc + '</p>' +
                            '<img src="https://image.flaticon.com/icons/svg/526/526127.svg" class="edit-task">';
        (domStuff.projectUL).insertBefore(newLi, domStuff.addToDoLi);
        newLi.appendChild(titleDiv);
        newLi.appendChild(infoDiv);
        if (dateAdded == '') {
            dateAdded = dateStuff.currentDate();
        }
        dateStuff.setTaskDate(dateAdded, newLi);
        for (let i = 0; i < holdingProjects.projectHolderArr.length; i++) {
            if (holdingProjects.projectHolderArr[i].name == (domStuff.projectContentHeader).textContent) {
                (holdingProjects.projectHolderArr[i].items).push([newTask, priorClass, dateAdded, taskDesc]);
            }
        }
        let span = newLi.querySelector('span');
        span.classList.add(priorClass);
        span.addEventListener('click', checked.checkedTask);
        titleDiv.children[3].addEventListener('click', delTask.deleteTask);
        infoDiv.style.display = 'none';
        let titleP = titleDiv.querySelector('p');
        titleP.classList.add('task-title');
        titleP.addEventListener('click', domStuff.showHideTaskInfo);
        infoDiv.children[1].addEventListener('click', domStuff.openEditTaskForm);
        localStorage.setItem('Projects', JSON.stringify(holdingProjects.projectHolderArr));
    }

    return { addTasktoList }
})();

const editPrior = (function() {
    const editPriority = function() {
        let editedChoice;
        domStuff.editPriorityBtns.forEach(function(btn) {
            if (btn.checked) {
                editedChoice = btn.value;
            }
        });
        return editedChoice;
    }
    return { editPriority };
})();

const addEdit = (function() {
    const changeTaskInfo = function(e) {
        e.preventDefault();
        let editedTaskName = (domStuff.editName).value;
        let newPriority = editPrior.editPriority();
        let newTaskDesc = (domStuff.editInfo).value;
        let newTaskDate = (domStuff.editDate).value;
        let liDiv = domStuff.taskToEditArr[0];
        let taskTitle = editedTaskName.length == 0 ? (liDiv.children[0].children[1]).textContent : editedTaskName;
        let taskDesc = newTaskDesc.length == 0 ? (liDiv.children[1].children[0]).textContent : newTaskDesc;
        let taskDate;
        for (let i = 0; i < (holdingProjects.projectHolderArr).length; i++) {
            if (holdingProjects.projectHolderArr[i].name == domStuff.projectContentHeader.textContent) {
                for (let j = 0; j < (holdingProjects.projectHolderArr[i].items).length; j++) {
                    if ((holdingProjects.projectHolderArr[i]).items[j][0] == (liDiv.children[0].children[1]).textContent) {
                        taskDate = newTaskDate == '' ?(holdingProjects.projectHolderArr[i]).items[j][2] : newTaskDate;
                        (holdingProjects.projectHolderArr[i]).items[j] = [taskTitle, newPriority, taskDate, taskDesc];
                    }
                }
            }
        }
        liDiv.children[0].innerHTML = '<span class="checkbox"></span> <p>' + taskTitle + '</p>' +
        '<time> <em> Tomorrow </em></time>' +  
        '<img src="https://image.flaticon.com/icons/svg/458/458594.svg" class="task-delete-button">';
        liDiv.children[1].innerHTML = '<p>' + taskDesc + '</p>' +
        '<img src="https://image.flaticon.com/icons/svg/526/526127.svg" class="edit-task">';
        (domStuff.editTaskFormCover).style.display = 'none';
        (domStuff.editTaskForm).reset();
        dateStuff.setTaskDate(taskDate, liDiv);
        let span = liDiv.querySelector('span');
        span.classList.add(newPriority);
        span.addEventListener('click', checked.checkedTask);
        let titleP = liDiv.children[0].querySelector('p');
        titleP.classList.add('task-title');
        titleP.addEventListener('click', domStuff.showHideTaskInfo);
        liDiv.children[1].children[1].addEventListener('click', domStuff.openEditTaskForm);
        liDiv.children[0].children[3].addEventListener('click', delTask.deleteTask);
        localStorage.setItem('Projects', JSON.stringify(holdingProjects.projectHolderArr));
    }

    return { changeTaskInfo };
})();

const addProjBtnClick = (function() {
    (domStuff.navAddProj).addEventListener('click', addProj.makeNewProj);
})();

[...domStuff.navDeleteBtns].forEach(function(navDelButton) {
    navDelButton.addEventListener('click', delProj.deleteProj);
});

[...domStuff.navProjectNames].forEach(function(navProjectName) {
    navProjectName.addEventListener('click', switchProj.changeProjPage);
});

const openFormBtnClick = (function() {
    (domStuff.addToDoLi).addEventListener('click', domStuff.openTaskForm);
})();

const addTaskBtnClick = (function() {
    (domStuff.addTaskBtn).addEventListener('click', addTask.addTasktoList);
})();

[...domStuff.taskDeleteBtns].forEach(function(taskDelBtn) {
    taskDelBtn.addEventListener('click', delTask.deleteTask);
});

[...domStuff.checkboxBtns].forEach(function(checkbox) {
    checkbox.addEventListener('click', checked.checkedTask);
});

[...domStuff.todoTaskTitle].forEach(function(title) {
    title.addEventListener('click', domStuff.showHideTaskInfo);
});

[...domStuff.editTaskBtns].forEach(function(editButton) {
    editButton.addEventListener('click', domStuff.openEditTaskForm);
});

const clearEdit = (function() {
    (domStuff.cancelEditBtn).addEventListener('click', domStuff.closeEditTaskForm);
})();

const confirmEdit = (function() {
    (domStuff.confirmEditBtn).addEventListener('click', addEdit.changeTaskInfo);
})();

const storageStuff = (function() {
    const loadProj = function() {
        if (!localStorage) {
            return;
        } else {
            holdingProjects.projectHolderArr = JSON.parse(localStorage.getItem('Projects'));
            domStuff.projectContentHeader.textContent = 'General';
            for (let i = 0; i < holdingProjects.projectHolderArr.length; i++) {
                if (holdingProjects.projectHolderArr[i].name == 'General') {
                    for (let j = 0; j < holdingProjects.projectHolderArr[i].items.length; j++) {
                        let storedTask = document.createElement('li');
                        let titleDiv = document.createElement('div');
                        let infoDiv = document.createElement('div');
                        let listItem = holdingProjects.projectHolderArr[i].items[j][0];
                        let priority = holdingProjects.projectHolderArr[i].items[j][1]
                        let date = holdingProjects.projectHolderArr[i].items[j][2];
                        let description = holdingProjects.projectHolderArr[i].items[j][3];
                        titleDiv.innerHTML =  '<span class="checkbox"></span> <p>' + listItem + 
                                            '</p> <time> <em> Tomorrow </em></time>' + 
                                            '<img src="https://image.flaticon.com/icons/svg/458/458594.svg" class="task-delete-button">';
                        infoDiv.innerHTML = '<p>' + description + '</p>' +
                                            '<img src="https://image.flaticon.com/icons/svg/526/526127.svg" class="edit-task">';
                        storedTask.appendChild(titleDiv);
                        storedTask.appendChild(infoDiv);
                        (domStuff.projectUL).insertBefore(storedTask, domStuff.addToDoLi);
                        let span = titleDiv.querySelector('span');
                        span.classList.add(priority);
                        titleDiv.children[3].addEventListener('click', delTask.deleteTask);
                        titleDiv.classList.add('task-item');
                        infoDiv.classList.add('info');
                        infoDiv.style.display = 'none';
                        let titleP = titleDiv.querySelector('p');
                        titleP.classList.add('task-title');
                        titleP.addEventListener('click', domStuff.showHideTaskInfo);
                        dateStuff.setTaskDate(date, storedTask);
                        span.addEventListener('click', checked.checkedTask);
                    }
                }
            }
        }
    }

    return { loadProj }
})();

window.onload = storageStuff.loadProj();
