import React from "react";

const statisticsData = [
  {
    title: "Services Offered",
    value: 25,
    newItems: 10,
    icon: "flaticon-contract",
    meta: "New Offered",
  },
  {
    title: "Completed",
    value: 1292,
    newItems: 80,
    icon: "flaticon-success",
    meta: "New Done",
  },
  {
    title: "in Queue",
    value: 182,
    newItems: 35,
    icon: "flaticon-review",
    meta: "New Queue",
  },
  {
    title: "Total Review",
    value: 22786,
    newItems: 290,
    icon: "flaticon-review-1",
    meta: "New Review",
  },
];

const DashboardTopInfo = () => {
  return (
    <div className="row">
      {statisticsData.map((statistic, index) => (
        <div className="col-sm-6 col-xxl-3" key={index}>
          <div className="d-flex align-items-center justify-content-between statistics_funfact">
            <div className="details">
              <div className="fz15">{statistic.title}</div>
              <div className="title">{statistic.value}</div>
              <div className="text fz14">
                <span className="text-thm">{statistic.newItems}+ </span>
                {statistic.meta}
              </div>
            </div>
            <div className="icon text-center">
              <i className={statistic.icon} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTopInfo;
