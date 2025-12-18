import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "./Context/UserContext";
import { useTheme } from "./Context/ThemeContext";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Setting = () => {
  const { userId } = useUserContext();
  const { theme } = useTheme();

  const [profilePic, setProfilePic] = useState(null);
  const [editName, setEditName] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [salary, setSalary] = useState("");
  const [budgets, setBudgets] = useState([]);

  // ---------------------------
  // FETCH USER
  // ---------------------------
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/auth/me?userId=${userId}`
      );
      setProfilePic(res.data.profilePic);
      setEditName(res.data.name);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------------------
  // FETCH BUDGET HISTORY
  // ---------------------------
  const fetchBudgets = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/exp/getall/${userId}`
      );
      setBudgets(res.data.budgets || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUser();
    fetchBudgets();
  }, [userId]);

  // ---------------------------
  // IMAGE UPLOAD
  // ---------------------------
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setProfilePic(base64);

      try {
        await axios.put("http://localhost:3000/auth/edit-image", {
          userId,
          profileImage: base64,
        });
        toast.success("Image Updated!");
      } catch {
        toast.error("Failed to upload image!");
      }
    };

    reader.readAsDataURL(file);
  };

  // ---------------------------
  // UPDATE NAME
  // ---------------------------
  const handleNameUpdate = async () => {
    if (editName.length < 3) return toast.error("Name too short");
    try {
      await axios.put("http://localhost:3000/auth/edit-name", {
        userId,
        name: editName,
      });
      toast.success("Name Updated!");
    } catch {
      toast.error("Error updating name!");
    }
  };

  // ---------------------------
  // PASSWORD CHANGE
  // ---------------------------
  const handlePasswordUpdate = async () => {
    if (newPass.length < 8)
      return toast.error("Password must be 8+ characters");

    try {
      await axios.put("http://localhost:3000/auth/edit-password", {
        userId,
        oldPassword: oldPass,
        newPassword: newPass,
      });

      toast.success("Password Updated!");
      setOldPass("");
      setNewPass("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error!");
    }
  };

  // ---------------------------
  // ADD SALARY
  // ---------------------------
  const handleSalaryUpdate = async () => {
    try {
      await axios.post("http://localhost:3000/user/update-salary", {
        userId,
        salary,
      });
      toast.success("Salary Updated!");
    } catch {
      toast.error("Error updating salary!");
    }
  };

  // ---------------------------
  // DELETE BUDGET
  // ---------------------------
const deleteBudget = async (id) => {
  try {
    const confirmed = window.confirm("Are you sure you want to delete this budget?");
    if (!confirmed) return;

    await axios.delete(`http://localhost:3000/exp/delete-budget/${id}`, {
      data: { userId }  // 👈 required
    });

    toast.success("Budget Deleted!");
    fetchBudgets();    // refresh list
  } catch (err) {
    console.log("Delete Error:", err);
    toast.error("Delete failed!");
  }
};


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ------------------------------------------
  // UI STARTS HERE
  // ------------------------------------------
  return (
    <div
      className={`p-6 space-y-6 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* PROFILE IMAGE */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-neutral-900 text-white border-neutral-700"
            : "bg-white text-black"
        }`}
      >
        <CardHeader>
          <CardTitle>Profile Image</CardTitle>
          <CardDescription>Upload or update your profile picture</CardDescription>
        </CardHeader>

        <CardContent className="flex gap-4 items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border">
            {profilePic ? (
              <img src={profilePic} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                No Image
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="cursor-pointer"
          />
        </CardContent>
      </Card>

      {/* NAME */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-neutral-900 text-white border-neutral-700"
            : "bg-white text-black"
        }`}
      >
        <CardHeader>
          <CardTitle>Edit Name</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-3">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className={`${
              theme === "dark"
                ? "bg-neutral-800 text-white border-neutral-700"
                : "bg-white text-black"
            }`}
          />
          <Button className="bg-[#B33791] hover:bg-[#c9a9c0]" onClick={handleNameUpdate}>
            Save
          </Button>
        </CardContent>
      </Card>

      {/* PASSWORD */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-neutral-900 text-white border-neutral-700"
            : "bg-white text-black"
        }`}
      >
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            type="password"
            placeholder="Old Password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className={`${
              theme === "dark"
                ? "bg-neutral-800 text-white border-neutral-700"
                : "bg-white text-black"
            }`}
          />

          <Input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className={`${
              theme === "dark"
                ? "bg-neutral-800 text-white border-neutral-700"
                : "bg-white text-black"
            }`}
          />

          <Button className="bg-[#B33791] hover:bg-[#d0b1c8]" onClick={handlePasswordUpdate}>
            Update
          </Button>
        </CardContent>
      </Card>

      {/* SALARY */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-neutral-900 text-white border-neutral-700"
            : "bg-white text-black"
        }`}
      >
        <CardHeader>
          <CardTitle>Salary</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-3">
          <Input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className={`${
              theme === "dark"
                ? "bg-neutral-800 text-white border-neutral-700"
                : "bg-white text-black"
            }`}
          />
          <Button className="bg-[#B33791] hover:bg-[#c6b2c1]" onClick={handleSalaryUpdate}>
            Save
          </Button>
        </CardContent>
      </Card>

      {/* BUDGET HISTORY */}
      <Card
        className={`${
          theme === "dark"
            ? "bg-neutral-900 text-white border-neutral-700"
            : "bg-white text-black"
        }`}
      >
        <CardHeader>
          <CardTitle>Budget History</CardTitle>
          <CardDescription>Track previous budgets & performance</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow
                className={`${
                  theme === "dark"
                    ? "bg-[#50374c] text-green-200"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {budgets.map((b) => (
                <TableRow
                  key={b._id}
                  className={`border-b ${
                    theme === "dark"
                      ? "border-neutral-700 hover:bg-neutral-800"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <TableCell className="capitalize">{b.budgetType}</TableCell>
                  <TableCell>₹{b.budgetamount}</TableCell>
                  <TableCell>₹{b.spent}</TableCell>
                  <TableCell>₹{b.loss}</TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        theme === "dark"
                          ? "bg-neutral-800 text-gray-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        b.status === "high"
                          ? "text-red-400 dark:text-red-300"
                          : b.status === "low"
                          ? "text-green-400 dark:text-green-300"
                          : "text-yellow-400 dark:text-yellow-300"
                      }
                    >
                      {b.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Button
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                      onClick={() => deleteBudget(b._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
