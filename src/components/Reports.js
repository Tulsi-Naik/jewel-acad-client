import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarDay, FaCalendarAlt } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

const Reports = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dailyReport, setDailyReport] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async (start, end) => {
    setLoading(true);
    setError('');
    try {
      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');
      const monthStr = format(start, 'yyyy-MM'); // monthly still uses only start

      const daily = await axios.get(`/reports/daily?start=${startStr}&end=${endStr}`);
      const monthly = await axios.get(`/reports/monthly?month=${monthStr}`);

      setDailyReport(daily.data);
      setMonthlyReport(monthly.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchReports(startDate, endDate);
    }
  }, [startDate, endDate]);

  return (
    <div className="container my-5">
      <h2 className="text-center text-dark mb-4">📊 Jewellery Sales Dashboard</h2>

      <div className="d-flex justify-content-center mb-4 position-relative" style={{ zIndex: 999 }}>
        <div className="input-group w-auto">
          <span className="input-group-text">
            <FaCalendarDay />
          </span>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end || start);
            }}
            dateFormat="dd-MM-yyyy"
            className="form-control"
            maxDate={new Date()}
            isClearable
            placeholderText="Select date range"
            popperPlacement="bottom"
            popperModifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white">
          <div className="spinner-border text-light" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Daily Report */}
          <div className="col-md-6">
            <div className="card bg-gradient bg-dark text-light shadow-sm border-0">
              <div className="card-header d-flex align-items-center bg-success text-white">
                <FaCalendarDay className="me-2" />
                <h5 className="mb-0">Daily Sales Report</h5>
              </div>
              <div className="card-body">
                {dailyReport.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {dailyReport.map((sale, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between text-light"
                        style={{ backgroundColor: 'inherit', cursor: 'default' }}
                      >
                        <span>{format(parseISO(sale.date), 'dd-MM-yyyy')}</span>
                        <strong>₹ {sale.total}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-light" style={{ color: '#ccc' }}>
                    No sales for selected day range.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Report */}
          <div className="col-md-6">
            <div className="card bg-gradient bg-dark text-light shadow-sm border-0">
              <div className="card-header d-flex align-items-center bg-primary text-white">
                <FaCalendarAlt className="me-2" />
                <h5 className="mb-0">Monthly Sales Report</h5>
              </div>
              <div className="card-body">
                {monthlyReport.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {monthlyReport.map((sale, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between text-light"
                        style={{ backgroundColor: 'inherit', cursor: 'default' }}
                      >
                        <span>{format(parseISO(sale.month + '-01'), 'MM-yyyy')}</span>
                        <strong>₹ {sale.total}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-light" style={{ color: '#ccc' }}>
                    No sales for selected month.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger mt-4">{error}</div>}
    </div>
  );
};

export default Reports;
