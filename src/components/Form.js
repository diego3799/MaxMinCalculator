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
  const [board, setBoard] = useState(null);
  const [arrayPoints, setArrayPoints] = useState([]);

  const { control, errors, register, handleSubmit } = useForm({
    defaultValues: {
      objx: 0,
      objy: 0,
      eq: [
        { x: 0, y: 0, sign: ">=", z: 0 },
      ],
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
    board.removeObject(arrayPoints);
    const objective = {
      x: info.todo === "min" ? info.objx : -1 * info.objx,
      y: info.todo === "min" ? info.objy : -1 * info.objy,
    };
    const API_URL = "https://manmixserver.vercel.app";
    // const API_URL = "http://localhost:5000";

    try {
      const { data } = await axios.post(
        `${API_URL}`,
        {
          objective,
          equations: info.eq,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      let arrayAux = [];
      /**Poner las dos restricciones de x>0 y y>0 */
      let restX = board.create("line", [0, 1, 0], {
        strokeColor: "#285e61",
      });
      arrayAux.push(restX);
      let restriccionX = board.create("inequality", [restX], {
        inverse: false,
        fillColor: "#44337a",
      });
      arrayAux.push(restriccionX);
      let restY = board.create("line", [0, 0, 1], {
        strokeColor: "#285e61",
      });
      arrayAux.push(restY);
      let restriccionY = board.create("inequality", [restY], {
        inverse: false,
        fillColor: "#44337a",
      });
      arrayAux.push(restriccionY);

      /**Graficar la solucion y el punto */
      let resultado = data.result;
      let xfinal = data.resultX;
      let yfinal = data.resultY;
      /**Redondear a dos decimales */
      resultado = Math.round(100 * resultado) / 100;
      xfinal = Math.round(100 * xfinal) / 100;
      yfinal = Math.round(100 * yfinal) / 100;
      /**Linea final */
      let finalLine = board.create(
        "line",
        [-1 * resultado, info.objx, info.objy],
        {
          strokeColor: "#97266d",
        }
      );
      arrayAux.push(finalLine);
      /**Punto de solucion */
      let puntoSolucion = board.create("point", [xfinal, yfinal]);
      arrayAux.push(puntoSolucion);
      /**Apartir de aqui tenemos que graficar */
      info.eq.forEach((item) => {
        let line1 = board.create(
          "line",
          [-1 * parseFloat(item.z), item.x, item.y],
          {
            strokeColor: "#285e61",
          }
        );
        arrayAux.push(line1);
        let restric1 = board.create("inequality", [line1], {
          inverse: item.sign === ">=" ? false : true,
          fillColor: "#44337a",
        });
        arrayAux.push(restric1);
      });
      setArrayPoints(arrayAux);
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
  useEffect(() => {
    const b = window.JXG.JSXGraph.initBoard("box", {
      boundingbox: [-10, 10, 10, -10],
      axis: true,
    });
    setBoard(b);
    /** constante X Y */
    /**Los que son menor o igual tienen que tener inversa */
    /**TODO: PROBLEMA 2 */
    /**Contraint 1 */
    // const line1 = board.create("line", [-24, 6, 4], { strokeColor: "#285e61" });
    // board.create("inequality", [line1], {
    //   inverse: true,
    //   fillColor: "#44337a",
    // });
    // /** Constraint 2*/
    // const line2 = board.create("line", [-6, 1, 2], { strokeColor: "#285e61" });
    // board.create("inequality", [line2], {
    //   inverse: true,
    //   fillColor: "#44337a",
    // });
    // /**Constraint 3 */
    // const line3 = board.create("line", [-1, -1, -1], {
    //   strokeColor: "#285e61",
    // });
    // board.create("inequality", [line3], {
    //   inverse: true,
    //   fillColor: "#44337a",
    // });
    // /**Constraint 4 */
    // const line4 = board.create("line", [-2, 0, 1], { strokeColor: "#285e61" });
    // board.create("inequality", [line4], {
    //   inverse: true,
    //   fillColor: "#44337a",
    // });
    /**TODO: PROBLEMA 1 */
    // /**Constraint 1 */
    // const line1 = board.create("line", [-800, 1, 1]);
    // board.create("inequality", [line1]);
    // /**Constraint 2 */
    // const line2 = board.create("line", [0, 0.21, -0.3]);
    // board.create("inequality", [line2], { inverse: true });
    // /**Constraint 3 */
    // const line3 = board.create("line", [0, 0.03, -0.01]);
    // board.create("inequality", [line3]);
  }, []);

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
                  {" "}
                  Calcular
                  {loading && (
                    <i className="animate-spin ml-2 fa fa-circle-o-notch" />
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className=" border border-gray-200 rounded-md p-5">
            <div id="ggb-element" style={{ display: "none" }}></div>
            <div
              id="box"
              style={{
                width: 550,
                height: 600,
              }}
            ></div>
            <div className="flex items-startz">
              <ul className="w-1/2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg bg-red-600 mr-3" />
                  Punto de la solución
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg border border-black mr-3" />
                  Area de soluciones factibles
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg bg-purple-900 mr-3" />
                  Area de soluciones no factibles
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg bg-pink-800 mr-3" />
                  Función Objetivo
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg bg-teal-800 mr-3" />
                  Equaciones
                </li>
              </ul>
              <div className="w-1/2">
                <p>Usa los botones de arriba para moverte por la gráfica</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {data && <img src={`data:image/png;base64,${data}`} />} */}
    </div>
  );
};

export default Form;
