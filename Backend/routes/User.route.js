import exxpress from 'express';
import {
  getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/UserController.js';  
const router = exxpress.Router();
// Định nghĩa các route
router.get('/', getAllUsers); // Lấy danh sách người dùng
router.get('/:id', getUserById);
router.post('/', createUser); // Thêm người dùng
router.put('/:id', updateUser); // Cập nhật người dùng
router.delete('/:id', deleteUser); // Xoá người dùng
export default router;