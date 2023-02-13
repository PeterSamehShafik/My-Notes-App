import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Notes.css'
import jwtDecode from 'jwt-decode';
import ReadMore from './../ReadMore/ReadMore';
import $ from 'jquery'

function Notes({ currentUser, decodeToken }) {
  const headers = { authorization: "peter__" + localStorage.getItem('userToken') }
  const userID = jwtDecode(localStorage.getItem('userToken'))._id
  const [notes, setNotes] = useState(null)
  const [currentNote, setCurrentNote] = useState(null)
  const [openedNote, setOpenedNote] = useState(null)
  const baseURL = 'https://be-server-movie-notes.vercel.app/api/v1/note'

  useEffect(() => {
    getNotesFromAPI();
  }, [])

  async function getNotesFromAPI() {
    let result = await axios.get(`${baseURL}/getUserNotes`, { headers })
    // .catch(function (error) {
    //   if (error) {
    //     console.log(error)
    //   }
    // })
    if (result?.data?.message == "done") {
      setNotes(result.data.notes)
    } else {
      setNotes([])
    }
  }

  async function addNote() {
    let noteTitle = document.getElementById('noteTitle').value,
      noteContent = document.getElementById('noteContent').value;
    let sendNote = {
      title: noteTitle,
      desc: noteContent,
    };

    // if(noteTitle.length>0 && noteContent.length>0){
    let { data } = await axios.post(`${baseURL}/addNote`, sendNote, {
      headers
    })
    // console.log(data)
    if (notes) {
      setNotes(notes => [...notes, sendNote])
    } else {
      setNotes(sendNote)
    }
    document.getElementById('noteTitle').value = ''
    document.getElementById('noteContent').value = ''
    getNotesFromAPI()
    // }else{
    // document.getElementById('emptyErr').style.display='block'
    // }

  }

  function getCurrentNote(note) {
    // showModal('editModal')
    setCurrentNote(note)

    document.getElementById('editNoteTitle').value = note.title
    document.getElementById('editNoteContent').value = note.desc
  }

  // console.log(notes)
  // if(currentNote)console.log(currentNote._id)

  async function deleteNote() {
    // console.log(currentNote._id)
    let { data } = await axios.delete(`${baseURL}/deleteNote`, {
      data: {
        noteID: currentNote._id,
      },
      headers
    })
    // console.log(data)
    getNotesFromAPI()
  }

  async function deleteAllNotes() {
    for (let i = 0; i < notes.length; i++) {
      let { data } = await axios.delete(`${baseURL}/deleteNote`, {
        data: {
          noteID: notes[i]._id,
        },
        headers
      })
    }

    getNotesFromAPI()
    setNotes([])
  }

  async function editNote() {
    // console.log(currentNote)
    const editNoteTitle = document.getElementById('editNoteTitle')
    const editNoteContent = document.getElementById('editNoteContent')

    let { data } = await axios.put(`${baseURL}/updateNote`,
      {
        title: editNoteTitle.value,
        desc: editNoteContent.value,
        noteID: currentNote._id,
      },
      { headers }
    )
    // console.log(data)
    // if(data){
    //   // document.getElementById('editModal').hidden=true
    //   // document.querySelector('.modal-backdrop').classList.remove('show')
    // }
    document.getElementById('editNoteTitle').value = ''
    document.getElementById('editNoteContent').value = ''
    getNotesFromAPI()
  }

  // function showModal(modal){
  //   document.querySelector('.modal-backdrop').classList.add('show')
  //   // document.getElementById(modal).hidden=false
  // }
  function openNote(noteNumber) {
    setOpenedNote(noteNumber)
    document.getElementById('noteBody').innerHTML = notes[noteNumber].desc
    document.getElementById('noteHeadr').innerHTML = notes[noteNumber].title
  }

  function slideRight() {
    if (openedNote + 1 > notes.length - 1) {
      setOpenedNote(0)
      document.getElementById('noteBody').innerHTML = notes[0].desc
      document.getElementById('noteHeadr').innerHTML = notes[0].title
    } else {
      setOpenedNote(openedNote + 1)
      document.getElementById('noteBody').innerHTML = notes[openedNote + 1].desc
      document.getElementById('noteHeadr').innerHTML = notes[openedNote + 1].title
    }

  }
  function slideLeft() {
    if (openedNote - 1 < 0) {
      setOpenedNote(notes.length - 1)
      document.getElementById('noteBody').innerHTML = notes[notes.length - 1].desc
      document.getElementById('noteHeadr').innerHTML = notes[notes.length - 1].title
    } else {
      setOpenedNote(openedNote - 1)
      document.getElementById('noteBody').innerHTML = notes[openedNote - 1].desc
      document.getElementById('noteHeadr').innerHTML = notes[openedNote - 1].title
    }
  }
  // console.log(openedNote)

  //settings of color 
  $('.settings li div').on('click', function (e) {
    var r = document.querySelector(':root');
    let newColor = $(this).css('backgroundColor')
    r.style.setProperty('--main-color', newColor);
    r.style.setProperty('--hover', newColor);
  })

  function toggleSettings() {
    let moveBy = $('.color-box').outerWidth()
    let left = $('.settings').css('left')
    // console.log(left)
    if (left === '0px') {
      $('.settings').animate({ left: `-${moveBy}px` })
    } else {
      $('.settings').animate({ left: `0px` })
    }
  }

  return (
    <>

      <div className="settings position-fixed top-50  bg-dark d-flex align-items-center justify-content-between">
        <ul className='d-flex color-box'>
          <li><div className='p-2  bg-tomato'></div></li>
          <li><div className='p-2  bg-yellow'></div></li>
          <li><div className='p-2  bg-blue'></div></li>
          <li><div className='p-2  bg-main'></div></li>
          {/* <li><div className='p-2  bg-danger'></div></li> */}
        </ul>
        <div onClick={toggleSettings}><i className="settings-btn fa-solid fa-gear px-2 py-3 fa-spin"></i></div>
      </div>

      <div className='add-button w-100 d-flex justify-content-end mt-5'>

        <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#addModal" >
          Add a Note
        </button>
        {notes ? notes.length ?
          <button type="button" className="btn btn-danger ms-2" data-bs-toggle="modal" data-bs-target="#deleteAllModal" >
            Delete All
          </button>
          : '' : ''}

      </div>

      {notes === null ?

        <div className="loading-screen align-items-center justify-content-center">
          <div className="lds-hourglass"></div>
        </div>
        :
        notes.length >= 0 ?
          <main className=' py-1'>
            <section className='mt-5'>
              <div className="row mt-5 gy-3">
                {notes?.map((note, idx) =>
                  note ?
                    <div key={idx} className="col-lg-3 col-md-4 col-sm-5  ">
                      <div className="item position-relative">
                        <div className="note px-2 py-1 ">
                          <div className="options d-flex w-100 justify-content-end">
                            <div className="dropdown ">
                              <span type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className='fas fa-ellipsis-v text-dark px-2'></i>
                              </span>
                              <ul className="dropdown-menu">
                                <li>
                                  <div onClick={() => getCurrentNote(note)} data-bs-toggle="modal" data-bs-target="#editModal" className="option text-info dropdown-item d-flex justify-content-between align-items-center">
                                    <span>Edit</span>
                                    <i className='fas fa-pen-square '></i>
                                  </div>
                                  <div onClick={() => getCurrentNote(note)} data-bs-toggle="modal" data-bs-target="#deleteModal" className="option text-danger dropdown-item d-flex justify-content-between align-items-center">
                                    <span type="button" >Delete</span>
                                    <i className='fas fa-trash  '></i>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="note-data text-center text-dark ">
                            <div className='note-title'>
                              <h2>{note.title}</h2>
                            </div>
                            <div className="note-content  mx-auto">
                              <p><ReadMore text={note.desc} /> </p>
                            </div>
                          </div>
                        </div>
                        <div onClick={() => openNote(idx)} data-bs-toggle="modal" data-bs-target="#noteModal" className="hover-layer position-absolute"></div>
                      </div>

                    </div>
                    : null
                )}

              </div>

            </section>
          </main>
          : ''
      }

      <div className="modals">

        <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark" id="addModalLabel">Add a new Note</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input type="text" className='form-control' placeholder='Title' id='noteTitle' />
                <textarea className='form-control' placeholder='Type Your Note' rows='10' id='noteContent'></textarea>
              </div>
              <div className="modal-footer">
                <button onClick={addNote} type="button" className="btn btn-info" data-bs-dismiss="modal">Add</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="doneModal" tabIndex="-1" aria-labelledby="doneModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark " id="doneModalLabel">Done</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="wrapper" >
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success " data-bs-dismiss="modal">Ok</button>
              </div>
            </div>
          </div>
        </div>

        {notes ? notes.length ?
          <>
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-dark " id="deleteModalLabel">Delete</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p className="lead text-dark">Are you Sure?</p>
                  </div>
                  <div className="modal-footer">
                    <button onClick={deleteNote} data-bs-toggle="modal" data-bs-target="#doneModal" type="button" data-bs-dismiss="modal" className="btn btn-danger" >Delete</button>
                    <button type="button" className="btn btn-info" data-bs-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-dark" id="editModalLabel">Edit</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <input type="text" className='form-control' placeholder='Title' id='editNoteTitle' />
                    <textarea className='form-control' placeholder='Type Your Note' rows='10' id='editNoteContent'  ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button data-bs-toggle="modal" data-bs-target="#doneModal" onClick={editNote} type="button" className="btn btn-info">Edit</button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="doneModal" tabIndex="-1" aria-labelledby="doneModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-dark " id="doneModalLabel">Done</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="wrapper" >
                      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                      </svg>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-success " data-bs-dismiss="modal">Ok</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade text-dark text-center" id="noteModal" tabIndex="-1" aria-labelledby="noteModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 id="noteHeadr" className='modal-title lead w-100 display-5'> </h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body d-flex justify-content-between align-items-center">
                    <button onClick={slideLeft} className='slider'>
                      <i className="fa fa-long-arrow-left arrow2" aria-hidden="true"></i>

                    </button>
                    <div id='noteBody'></div>
                    <button onClick={slideRight} className='slider'>
                      <i className="fa fa-long-arrow-right arrow1" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-info" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="deleteAllModal" tabIndex="-1" aria-labelledby="deleteAllModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-dark " id="deleteAllModalLabel">Delete</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p className="lead text-dark">Are you Sure? All notes will be Deleted!</p>
                  </div>
                  <div className="modal-footer">
                    <button onClick={deleteAllNotes} data-bs-toggle="modal" data-bs-target="#doneModal" type="button" data-bs-dismiss="modal" className="btn btn-danger" >Delete All</button>
                    <button type="button" className="btn btn-info" data-bs-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </>
          : '' : ''}

      </div>

    </>
  )
}

export default Notes