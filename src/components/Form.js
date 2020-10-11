import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
  objx: yup
    .number()
    .typeError("Ingresa solo numeros en X en la función objetivo")
    .required(),
  objy: yup
    .number()
    .typeError("Ingresa solo numeros en Y en la función objetivo")
    .required(),
  eq: yup.array().of(
    yup.object().shape({
      x: yup
        .number()
        .typeError("Escribe solo valores en las funciones")
        .required("Los valores en las funciones son obligatorios"),
      y: yup
        .number("Escribe solo numeros en las funciones")
        .typeError("Escribe solo valores en las funciones")
        .required("Los valores en las funciones son obligatorios"),
      z: yup
        .number("Escribe solo numeros en las funciones")
        .typeError("Escribe solo valores en las funciones")
        .required("Los valores en las funciones son obligatorios"),
    })
  ),
});

const Form = () => {
  const andGeo = "∧";
  const { control, errors, register, handleSubmit } = useForm({
    defaultValues: {
      objx: "",
      objy: "",
      eq: [{ x: "", y: "", sign: ">=", z: "" }],
    },
    reValidateMode: "onSubmit",
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "eq",
  });

  const onSubmit = async (info) => {
    setLoading(true);
    setError(null);
    window.ggbApplet.reset();
    const objective = {
      x: info.todo === "min" ? info.objx : -1 * info.objx,
      y: info.todo === "min" ? info.objy : -1 * info.objy,
    };
    try {
      const { data } = await axios.post("http://localhost:5000/solve", {
        objective,
        equations: info.eq,
      });
      let eqLines = [
        `solution: ${info.objx}x + ${info.objy}y=${
          info.todo === "min" ? data.result : -1 * data.result
        }`,
        `pointSolution= Point({${data.resultX},${data.resultY}})`,
      ];
      let eqArea = ["x>=0 ∧ y>=0"];
      info.eq.forEach((item, i) => {
        eqArea.push(` ${item.x}x + ${item.y}y ${item.sign} ${item.z}`);
        eqLines.push(`${item.x}x + ${item.y}y = ${item.z}`);
      });
      let areaAnd = eqArea.join(` ${andGeo} `);
      let finalString = eqLines.join("\n") + "\n" + areaAnd;
      graphicate(finalString);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Ocurrió un error de comunicación, intentelo de nuevo");
      }
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
    /**This creats de graphic */
    setLoading(false);
  };
  const graphicate = (finalString) => {
    window.ggbApplet.evalCommand(finalString);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setError("Verifica que todos los datos esten completos");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [errors]);

  return (
    <div className="container mx-auto">
      <div className=" rounded shadow-lg  overflow-hidden max-w-screen-xl px-5 py-2">
        <h2 className="text-center text-2xl font-roboto">
          Ingresa tus ecuaciones
        </h2>
        <div className="grid  lg:grid-cols-2 gap-5 mt-5">
          <div className=" border border-gray-200 rounded-md py-5 h-full">
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
                      <option value=">=">{"≥"}</option>
                      <option value="<=">{"≤"}</option>
                    </select>
                    <input
                      className="shadow w-20 text-right appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2"
                      placeholder="0"
                      name={`eq[${index}].z`}
                      ref={register()}
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
              {error && (
                <div className="my-5">
                  <div className="bg-red-300 text-red-600 border-l-4 border-red-600 py-4 px-3">
                    <p>{error}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-10 px-3">
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
            <div id="ggb-element"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
