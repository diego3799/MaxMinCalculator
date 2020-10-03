import React, { Fragment } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Form = () => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      equations: [{ x: "", y: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "equations",
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  const dataTable = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div className="container mx-auto">
      <div className=" rounded shadow-lg  overflow-hidden max-w-screen-xl px-5 py-2">
        <h2 className="text-center text-2xl font-roboto">
          Ingresa tus ecuaciones
        </h2>
        <div className="grid  lg:grid-cols-2 gap-5 mt-5">
          <div className=" border border-gray-200 rounded-md p-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className="text-xl text-center font-roboto">
                Función Objetivo:
              </p>
              <div className="flex items-center justify-between mx-5 my-5">
                <div className="flex items-center justify-center">
                  <input
                    className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                    placeholder="0"
                    name={`objx`}
                    ref={register()}
                  />
                  <p>x +</p>
                  <input
                    className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                    placeholder="0"
                    name={`objy`}
                    ref={register()}
                  />
                  <p>y</p>
                </div>
                <select
                  name={`todo`}
                  ref={register()}
                  className="appearance-none border  bg-white text-gray-700 py-1 px-2 rounded leading-tight focus:outline-none mx-2"
                >
                  <option value="max"> Maximizar </option>
                  <option value="min"> Minimizar </option>
                </select>
              </div>
              <p className="text-xl text-center font-roboto">Restricciones: </p>
              {fields.map((data, index) => (
                <div
                  className="flex  items-center justify-between mx-5 my-2"
                  key={data.id}
                >
                  <div className="w-full flex items-center">
                    <input
                      className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                      placeholder="0"
                      name={`equations[${index}].x`}
                      ref={register()}
                    />
                    <p>x +</p>
                    <input
                      className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                      placeholder="0"
                      name={`equations[${index}].y`}
                      ref={register()}
                    />
                    <p>y</p>
                    <select
                      name={`equations[${index}].sign`}
                      ref={register()}
                      className="appearance-none border w-10 bg-white text-gray-700 py-1 px-2 rounded leading-tight focus:outline-none mx-2"
                    >
                      <option value="="> = </option>
                      <option value=">=">{"≥"}</option>
                      <option value="<=">{"≤"}</option>
                    </select>
                    <input
                      name={`equations[${index}].obj`}
                      ref={register()}
                      className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                      placeholder="0"
                    />
                  </div>
                  <button
                    onClick={() => remove(index)}
                    className="font-bold focus:outline-none transition duration-500 ease-in-out bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full ml-3"
                  >
                    x
                  </button>
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <div>
                  <button
                    onClick={() => append()}
                    className="focus:outline-none  font-bold uppercase transition duration-500 ease-in-out bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded-full"
                  >
                    +
                  </button>
                </div>
                <button className="focus:outline-none font-bold uppercase transition duration-500 ease-in-out bg-green-400 hover:bg-green-500 text-white px-3  py-2 rounded-md">
                  Calcular
                </button>
              </div>
            </form>
          </div>
          <div className=" border border-gray-200 rounded-md p-5">
            <LineChart
              width={500}
              height={300}
              data={dataTable}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
