import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";

const Form = () => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      eq: [{ x: "", y: "" }],
    },
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "eq",
  });

  const onSubmit = async (info) => {
    setLoading(true);
    /**First we gotta parse the information into functions */
    let eqLines = [];
    let eqArea = [];
    info.eq.forEach((item, i) => {
      eqArea.push(` ${item.x}x + ${item.y}y ${item.sign} ${item.z}`);
      eqLines.push(`${item.x}x + ${item.y}y = ${item.z}`);
    });
    const { data } = await axios.post("http://localhost:5000/", {
      eqLines,
      eqArea,
    });
    setData(data);
    setLoading(false);

    // console.log(data.eq[1].toString());
  };

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
                      name={`eq[${index}.x`}
                      ref={register()}
                    />
                    <p className="whitespace-no-wrap"> x +</p>
                    <input
                      className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                      placeholder="0"
                      name={`eq[${index}.y`}
                      ref={register()}
                    />
                    <p>y</p>
                    <select
                      name={`eq[${index}].sign`}
                      ref={register()}
                      className="appearance-none border w-10 bg-white text-gray-700 py-1 px-2 rounded leading-tight focus:outline-none focus:shadow-outline mx-2"
                    >
                      <option value="="> = </option>
                      <option value=">=">{"≥"}</option>
                      <option value="<=">{"≤"}</option>
                    </select>
                    <input
                      name={`eq[${index}].z`}
                      ref={register()}
                      className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => append()}
                    className={`focus:outline-none  font-bold uppercase transition duration-500 ease-in-out bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded-full`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="submit"
                  className="focus:outline-none font-bold uppercase transition duration-500 ease-in-out bg-green-400 hover:bg-green-500 text-white px-3  py-2 rounded-md"
                >
                  Calcular
                  {loading && (
                    <i className="animate-spin ml-2 fa fa-circle-o-notch" />
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className=" border border-gray-200 rounded-md p-5">
            {data && <img src={data} alt="Grafica" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
