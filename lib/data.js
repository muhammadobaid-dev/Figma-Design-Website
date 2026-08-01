export const adminProfile = {
  name: "MUHAMMAD OBAID",
  role: "Administrator",
  email: "obaid@efandex.com",
  initials: "MO",
};

export const metrics = [
  {
    id: "users",
    title: "Active Users",
    value: "3,632",
    period: "Overall last month",
    change: 30.56,
    isPositive: true,
    trend: [18, 22, 20, 28, 26, 34, 32, 40, 38, 45],
  },
  {
    id: "properties",
    title: "Total Properties",
    value: "10k+",
    period: "Overall last month",
    change: 30.56,
    isPositive: true,
    trend: [12, 16, 15, 22, 24, 20, 28, 30, 35, 42],
  },
  {
    id: "revenue",
    title: "Total Revenue",
    value: "$900K",
    period: "Overall this month",
    change: 30.56,
    isPositive: false,
    trend: [42, 40, 38, 35, 32, 30, 28, 26, 24, 20],
  },
];

export const bookings = [
  {
    id: "bk-001",
    name: "Olivia Daddario",
    status: "Completed",
    price: "$633.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
  },
  {
    id: "bk-002",
    name: "Jack Paul",
    status: "In Progress",
    price: "$231.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
  },
  {
    id: "bk-003",
    name: "Mr Aalexandar",
    status: "Cancelled",
    price: "$260.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
  },
  {
    id: "bk-004",
    name: "Arnold Archer",
    status: "Completed",
    price: "$900.00",
    capacity: "60 (Seated)",
    duration: "24 May - 28 May 2024",
  },
];

export let userRegistrations = [
  {
    id: "usr-001",
    name: "Olivia Daddario",
    category: "Guest",
    joinDate: "Jan 13, 2022",
    email: "Userefandax1234@gmail.com",
    status: "pending",
  },
  {
    id: "usr-002",
    name: "Jack Paul",
    category: "Host",
    joinDate: "Jan 12, 2022",
    email: "Userefandax1234@gmail.com",
    status: "pending",
  },
  {
    id: "usr-003",
    name: "Mr Aalexandar",
    category: "Guest",
    joinDate: "Jan 12, 2022",
    email: "Userefandax1234@gmail.com",
    status: "pending",
  },
  {
    id: "usr-004",
    name: "Arnold Archer",
    category: "Host",
    joinDate: "Jan 12, 2022",
    email: "Userefandax1234@gmail.com",
    status: "pending",
  },
  {
    id: "usr-005",
    name: "Jack Paul",
    category: "Guest",
    joinDate: "Jan 12, 2022",
    email: "Userefandax1234@gmail.com",
    status: "pending",
  },
];

export function updateUserStatus(id, status) {
  userRegistrations = userRegistrations.map((user) =>
    user.id === id ? { ...user, status } : user
  );
  return userRegistrations.find((user) => user.id === id) ?? null;
}
