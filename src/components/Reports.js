//src/components/Reports.js
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
  const [topProducts, setTopProducts] = useState([]);

  const fetchReports = async (start, end) => {
    setLoading(true);
    setError('');
    try {
      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');
      const monthStr = format(start, 'yyyy-MM');

      const daily = await axios.get(`/reports/daily?start=${startStr}&end=${endStr}`);
      const monthly = await axios.get(`/reports/monthly?month=${monthStr}`);
      const top = await axios.get('/reports/top-products');


      setDailyReport(daily.data);
      setMonthlyReport(monthly.data);
      setTopProducts(top.data);
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

      {/* Date Pickers */}
      <div className="row justify-content-center mb-4" style={{ zIndex: 1050 }}>
  {/* From Date */}
  <div className="col-md-3 col-sm-6 mb-2">
    <div className="d-flex align-items-center">
      <label className="form-label fw-semibold text-dark me-2 mb-0">From Date</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          setStartDate(date);
          if (endDate && date > endDate) {
            setEndDate(date); // sync if start > end
          }
        }}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        maxDate={new Date()}
        isClearable
        dateFormat="dd-MM-yyyy"
        placeholderText="Select start date"
        className="form-control"
        popperPlacement="bottom"
        style={{
          outline: 'none',
          boxShadow: 'none',
          borderColor: '#ced4da',
          backgroundColor: 'white',
        }}
      />
    </div>
  </div>

  {/* To Date */}
  <div className="col-md-3 col-sm-6 mb-2">
    <div className="d-flex align-items-center">
      <label className="form-label fw-semibold text-dark me-2 mb-0">To Date</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        maxDate={new Date()}
        isClearable
        dateFormat="dd-MM-yyyy"
        placeholderText="Select end date"
        className="form-control"
        popperPlacement="bottom"
        style={{
          outline: 'none',
          boxShadow: 'none',
          borderColor: '#ced4da',
          backgroundColor: 'white',
        }}
      />
    </div>
  </div>
</div>


      {/* Spinner or Report Cards */}
      {loading ? (
        <div className="text-center text-dark">
          <div className="spinner-border text-secondary" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Daily Report */}
          <div className="col-md-6">
            <div className="card bg-dark text-light shadow-sm border-0">
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
                        style={{ backgroundColor: 'inherit' }}
                      >
                        <span>{format(parseISO(sale.date), 'dd-MM-yyyy')}</span>
                        <strong>₹ {sale.total}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#ccc' }}>No sales for selected date range.</p>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Report */}
          <div className="col-md-6">
            <div className="card bg-dark text-light shadow-sm border-0">
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
                        style={{ backgroundColor: 'inherit' }}
                      >
                        <span>{format(parseISO(sale.month + '-01'), 'MM-yyyy')}</span>
                        <strong>₹ {sale.total}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#ccc' }}>No sales for selected month.</p>
                )}
              </div>
            </div>
          </div>
          {/* Top Products */}
<div className="col-md-6">
  <div className="card bg-dark text-light shadow-sm border-0 mt-4">
    <div className="card-header d-flex align-items-center bg-warning text-dark">
      <h5 className="mb-0">Top Products</h5>
    </div>
    <div className="card-body">
      {topProducts.length > 0 ? (
        <ul className="list-group list-group-flush">
          {topProducts.map((item, idx) => (
            <li
              key={idx}
              className="list-group-item d-flex justify-content-between text-light"
              style={{ backgroundColor: 'inherit' }}
            >
              <span>{item.productName} ({item.quantity})</span>
              <strong>₹ {item.revenue}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#ccc' }}>No product data available.</p>
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
