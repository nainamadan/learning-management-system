import React, { useEffect, useRef, useState, useContext } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AddContext.jsx";

const AddCourse = () => {
  const { backendUrl, getToken, navigate } = useContext(AppContext);

  // ===== STATES =====
  const [courseHeading, setCourseHeading] = useState("");
  const [courseTitle, setTitle] = useState("");
  const [coursePrice, setPrice] = useState("");
  const [courseDiscount, setDiscount] = useState("");
  const [courseImage, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  // ===== ADD CHAPTER (FIXED) =====
  const handleAddChapter = () => {
    const title = prompt("Enter Chapter Name:");
    if (!title) return;

    const newChapter = {
      chapterId: uniqid(),
      chapterTitle: title,
      chapterContent: [],
      collapsed: false,
      chapterOrder: courseChapters.length + 1,
    };

    setChapters((prev) => [...prev, newChapter]);
  };

  const handleRemoveChapter = (id) => {
    setChapters((prev) => prev.filter((c) => c.chapterId !== id));
  };

  const toggleChapter = (id) => {
    setChapters((prev) =>
      prev.map((c) =>
        c.chapterId === id ? { ...c, collapsed: !c.collapsed } : c
      )
    );
  };

  // ===== ADD LECTURE =====
  const handleAddLecture = () => {
    if (!currentChapterId) return;

    setChapters((prev) =>
      prev.map((ch) =>
        ch.chapterId === currentChapterId
          ? {
              ...ch,
              chapterContent: [...ch.chapterContent, lectureDetails],
            }
          : ch
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
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = await getToken();

    const courseData = {
      courseHeading,
      courseTitle,
      coursePrice,
      courseDiscount,
      courseDescription: quillRef.current.root.innerHTML,
      courseChapters,
    };

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("image", courseImage);

    const { data } = await axios.post(
      backendUrl + "/api/educator/add-course",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success("Course Added Successfully");
      navigate("/educator/my-courses");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded">

        <h1 className="text-2xl font-bold mb-4">Add Course</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Course Heading"
            value={courseHeading}
            onChange={(e) => setCourseHeading(e.target.value)}
            className="border w-full p-2"
          />

          <input
            placeholder="Course Title"
            value={courseTitle}
            onChange={(e) => setTitle(e.target.value)}
            className="border w-full p-2"
          />

          {/* DESCRIPTION */}
          <div ref={editorRef} className="border min-h-[120px]" />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Price"
              value={coursePrice}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2"
            />
            <input
              type="number"
              placeholder="Discount"
              value={courseDiscount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border p-2"
            />
          </div>

          {/* IMAGE */}
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }}
          />

          {imagePreview && (
            <img src={imagePreview} className="h-40 object-cover rounded" />
          )}

          {/* ADD CHAPTER */}
          <button
            type="button"
            onClick={handleAddChapter}
            className="text-blue-600 font-bold"
          >
            + Add Chapter
          </button>

          {/* CHAPTER LIST */}
          {courseChapters.map((ch, i) => (
            <div key={ch.chapterId} className="border p-2">

              <div className="flex justify-between">
                <p
                  className="cursor-pointer"
                  onClick={() => toggleChapter(ch.chapterId)}
                >
                  {i + 1}. {ch.chapterTitle}
                </p>

                <button
                  type="button"
                  onClick={() => handleRemoveChapter(ch.chapterId)}
                >
                  ❌
                </button>
              </div>

              {!ch.collapsed && (
                <div className="pl-4 mt-2">

                  {ch.chapterContent.map((lec, i) => (
                    <p key={i}>
                      {lec.lectureTitle} - {lec.lectureDuration} min{" "}
                      {lec.isPreviewFree ? "(Preview)" : ""}
                    </p>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentChapterId(ch.chapterId);
                      setShowPopUp(true);
                    }}
                    className="text-sm text-blue-600 mt-2"
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}

          <button className="bg-blue-600 text-white w-full p-2 rounded">
            Add Course
          </button>

        </form>
      </div>

      {/* POPUP */}
      {showPopUp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 w-[300px] rounded">

            <input
              placeholder="Lecture Title"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureTitle: e.target.value,
                })
              }
              className="border w-full p-1 mb-2"
            />

            <input
              placeholder="Duration"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureDuration: e.target.value,
                })
              }
              className="border w-full p-1 mb-2"
            />

            <input
              placeholder="YouTube URL"
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureUrl: e.target.value,
                })
              }
              className="border w-full p-1 mb-2"
            />

            {/* PREVIEW OPTION FIXED */}
            <label className="flex items-center gap-2 text-sm mb-2">
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

            <button
              onClick={handleAddLecture}
              className="bg-blue-600 text-white p-1 w-full"
            >
              Add Lecture
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;