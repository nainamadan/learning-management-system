import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { assets } from "../../assets/assets.js";


const AddCourse = () => {
  // ===== STATES =====
  const [courseHeading, setCourseHeading] = useState("");
  const [courseTitle, setTitle] = useState("");
  const [coursePrice, setPrice] = useState(0);
  const [courseDiscount, setDiscount] = useState(0);
  const [courseImage, setImage] = useState(null);
  const [courseChapters, setChapters] = useState([]);

  const [showPopUp, setShowPopUp] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // ===== QUILL =====
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write course description here...",
      });
    }
  }, []);

  // ===== ADD / REMOVE / TOGGLE CHAPTER =====
  const handleChapter = (action, chapterId = null) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (!title) return;

      const newChapter = {
        chapterId: uniqid(),
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder:
          courseChapters.length > 0
            ? courseChapters[courseChapters.length - 1].chapterOrder + 1
            : 1,
      };

      setChapters([...courseChapters, newChapter]);
    }

    if (action === "remove") {
      setChapters(
        courseChapters.filter(
          (chapter) => chapter.chapterId !== chapterId
        )
      );
    }

    if (action === "toggle") {
      setChapters(
        courseChapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  // ===== ADD LECTURE =====
  const handleAddLecture = () => {
    if (!currentChapterId) return;

    setChapters(
      courseChapters.map((chapter) =>
        chapter.chapterId === currentChapterId
          ? {
              ...chapter,
              chapterContent: [
                ...chapter.chapterContent,
                { ...lectureDetails },
              ],
            }
          : chapter
      )
    );

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });

    setShowPopUp(false);
  };

  // ===== SUBMIT =====
  const handleSubmit = (e) => {
    e.preventDefault();

    const courseData = {
      courseHeading,
      courseTitle,
      coursePrice,
      courseDiscount,
      courseImage,
      description: quillRef.current.root.innerHTML,
      courseChapters,
    };

    console.log("FINAL COURSE DATA 👉", courseData);
    alert("Course Added Successfully ✅");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Add Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Heading */}
          <input
            type="text"
            placeholder="Course Heading"
            value={courseHeading}
            onChange={(e) => setCourseHeading(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Title */}
          <input
            type="text"
            placeholder="Course Title"
            value={courseTitle}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Description */}
          <div
            ref={editorRef}
            className="border rounded"
            style={{ minHeight: "180px" }}
          />

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price ($)"
              value={coursePrice}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded px-4 py-2"
            />
            <input
              type="number"
              placeholder="Discount (%)"
              value={courseDiscount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border rounded px-4 py-2"
            />
          </div>

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* ADD CHAPTER */}
          <button
            type="button"
            onClick={() => handleChapter("add")}
            className="text-blue-600 font-semibold"
          >
            + Add Chapter
          </button>

          {/* CHAPTER LIST */}
          {courseChapters.map((chapter, index) => (
            <div key={chapter.chapterId} className="border p-4 rounded">
              <div className="flex justify-between">
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() =>
                    handleChapter("toggle", chapter.chapterId)
                  }
                >
                  <img
                    src={assets.dropdown_icon}
                    className={`w-4 ${
                      chapter.collapsed ? "rotate-90" : ""
                    }`}
                  />
                  <b>
                    {index + 1}. {chapter.chapterTitle}
                  </b>
                </div>

                <img
                  src={assets.cross_icon}
                  className="w-4 cursor-pointer"
                  onClick={() =>
                    handleChapter("remove", chapter.chapterId)
                  }
                />
              </div>

              {!chapter.collapsed && (
                <div className="mt-3 space-y-2">
                  {chapter.chapterContent.map((lec, i) => (
                    <div key={i} className="text-sm">
                      {i + 1}. {lec.lectureTitle} • {lec.lectureDuration} mins •{" "}
                      {lec.isPreviewFree ? "Free" : "Paid"}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentChapterId(chapter.chapterId);
                      setShowPopUp(true);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            Add Course
          </button>
        </form>
      </div>

      {/* LECTURE POPUP */}
      {showPopUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[90%] max-w-md">
            <h2 className="font-bold mb-3">Add Lecture</h2>

            <input
              placeholder="Lecture Title"
              className="border w-full mb-2 px-3 py-2"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureTitle: e.target.value,
                })
              }
            />

            <input
              placeholder="Duration (mins)"
              className="border w-full mb-2 px-3 py-2"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureDuration: e.target.value,
                })
              }
            />

            <input
              placeholder="Video URL"
              className="border w-full mb-2 px-3 py-2"
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureUrl: e.target.value,
                })
              }
            />

            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    isPreviewFree: e.target.checked,
                  })
                }
              />
              Free Preview
            </label>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowPopUp(false)}>Cancel</button>
              <button
                onClick={handleAddLecture}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
