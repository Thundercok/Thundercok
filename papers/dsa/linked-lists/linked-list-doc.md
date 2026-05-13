# [01] Singly Linked List

Danh sách liên kết đơn là một cấu trúc dữ liệu tuyến tính. Không giống như mảng (Array) lưu trữ dữ liệu liền kề, các Node trong Linked List được lưu trữ rải rác trong RAM.

Mỗi Node chứa dữ liệu và một **con trỏ (pointer)** trỏ đến tọa độ của Node tiếp theo.

## 1. Trực quan hóa Bộ nhớ vật lý
Hãy tương tác với cỗ máy trạng thái dưới đây. Thử thêm một vài Node và quan sát cách hệ điều hành cấp phát RAM, cũng như cách mũi tên `next` thay đổi tọa độ:

::SIMULATOR[papers/linked-list.html]::

## 2. Phân tích Độ phức tạp (Complexity)
Dựa trên mô phỏng trên, ta rút ra định lý toán học:
* **Thêm vào đuôi (Append):** Quét mất `O(1)` vì ta duy trì biến `tail`.
* **Thêm vào đầu (Prepend):** Chỉ mất `O(1)` vì ta can thiệp trực tiếp vào `head`.

## 3. Cảnh báo Memory Leak
Tuyệt đối phải bẻ mũi tên `temp.next` nối vào danh sách **trước khi** bóc nhãn `head` dời đi chỗ khác. Nếu làm ngược lại, bạn sẽ cắt đứt bộ nhớ và kích hoạt Garbage Collector hủy toàn bộ danh sách cũ!
