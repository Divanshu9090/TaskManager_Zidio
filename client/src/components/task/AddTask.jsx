import { Dialog } from "@headlessui/react";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UserList";
import Loading from "../Loader";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen, task }) => {
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const URLS = task?.assets ? [...task.assets] : [];

  const submitHandler = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.log("Error uploading file: ", error?.message);
      } finally {
        setUploading(false);
      }
    }
    try {
      const newData = {
        ...data,
        team,
        stage,
        priority,
        assets: [...URLS, ...uploadedFileURLs],
      };
      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();
      toast.success(res?.message);
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_APP_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_APP_NAME);
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_CLOUDINARY_URL,
        formData
      );
      const { secure_url } = response.data;
      console.log("secure_url: ", secure_url);
      uploadedFileURLs.push(secure_url);
      return secure_url;
    } catch (error) {
      throw new Error("Error uploading to Cloudinary: " + error.message);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-semibold leading-6 text-gray-900 mb-4" // Adjusted to font-semibold
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded font-serif" // Changed to font-serif
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded font-serif" 
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>
            {isLoading || isUpdating ? (
              <div className="py-5">
                <Loading />
              </div>
            ) : (
              <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
                {uploading ? (
                  <span className="text-sm py-2 text-red-500">
                    Uploading assets
                  </span>
                ) : (
                  <Button
                    label="Submit"
                    type="submit"
                    className="bg-teal-600 px-8 text-sm font-semibold text-white hover:bg-teal-700 sm:w-auto"
                  />
                )}

                <Button
                  type="button"
                  className="bg-gray-200 px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                  onClick={() => setOpen(false)}
                  label="Cancel"
                />
              </div>
            )}
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
