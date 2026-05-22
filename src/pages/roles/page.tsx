import { useEffect, useState } from "react";
import { roleService, permissionService, type Permissions} from "../../lib/api";
import { toast } from "sonner";

// type Permission = {
//   id: string;
//   code: string;
// };

export default function CreateRolePage() {
  const [name, setName] = useState("");
  //const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const res = await permissionService.list();
      setPermissions(res);
    } catch {
      toast.error("Failed to load permissions");
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Role name is required");
      return;
    }

    try {
      setLoading(true);

      await roleService.create({
        name,
        permissionIds: selectedPermissions,
      });

      toast.success("Role created");

      // reset form
      setName("");
      //setDescription("");
      setSelectedPermissions([]);

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">Create Role</h1>

      {/* Role Info */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Role Name (e.g. HR Manager)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        {/* <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-lg"
        /> */}
      </div>

      {/* Permissions */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Assign Permissions</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {permissions.map((perm) => (
            <label
              key={perm.id}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
              />
              {perm.code}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Role"}
      </button>
    </div>
  );
}