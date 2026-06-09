// app/_components/OrdersList.jsx
"use client";

import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import ModalDeleteOrder from "./ModalDeleteOrder";

function OrdersList({ orders: initialOrders }) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleDeleteClick = (orderId) => {
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    const handleOrderDeleted = (deletedOrderId) => {
        setOrders((prev) =>
            prev.filter((order) => order.id !== deletedOrderId),
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            shipped:
                "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
            delivered:
                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            cancelled:
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        };
        return statusConfig[status] || statusConfig.pending;
    };

    return (
        <>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="relative group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* دکمه حذف */}
                        <button
                            onClick={() => handleDeleteClick(order.id)}
                            className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            title="Cancel Order"
                        >
                            <FaTrashAlt className="w-5 h-5" />
                        </button>

                        <div className="p-6">
                            {/* هدر سفارش */}
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                        Order ID
                                    </span>
                                    <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">
                                        #{order.id}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                        Order Date
                                    </span>
                                    <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                                        {formatDate(order.order_date)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                        Total Amount
                                    </span>
                                    <p className="text-gray-800 dark:text-gray-200 font-bold text-lg mt-1">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                        Status
                                    </span>
                                    <div className="mt-1">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                                                order.status,
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* جزئیات محصولات سفارش */}
                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Items:
                                </h4>
                                <div className="space-y-3">
                                    {order.order_items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                <Image
                                                    src={
                                                        item.suits?.image ||
                                                        "/placeholder.jpg"
                                                    }
                                                    alt={
                                                        item.suits?.name ||
                                                        "Product"
                                                    }
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                                    {item.suits?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Quantity: {item.quantity} ×
                                                    ${item.price}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                    $
                                                    {(
                                                        item.quantity *
                                                        item.price
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ModalDeleteOrder
                showModal={showModal}
                setShowModal={setShowModal}
                orderId={selectedOrderId}
                onDelete={handleOrderDeleted}
            />
        </>
    );
}

export default OrdersList;
