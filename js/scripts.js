
    // Declaración de las variables que almacenarán los roommates y gastos.
    let roommates = [];
    let gastos = [];

    // Variable para mantener el id del gasto que está siendo editado (inicialmente es null).
    let gastoEditing = null;

    // Función asincrónica para obtener los roommates desde el servidor.
    const getRoommates = async () => {
      const res = await fetch("http://localhost:3000/roommates"); // Hace una solicitud GET al servidor para obtener los roommates.
      const data = await res.json(); // Parsea la respuesta del servidor en formato JSON.
      roommates = data.roommates; // Almacena los roommates obtenidos en la variable roommates.
    };

    // Función asincrónica para obtener los gastos desde el servidor.
    const getGastos = async () => {
      const res = await fetch("http://localhost:3000/gastos"); // Hace una solicitud GET al servidor para obtener los gastos.
      const data = await res.json(); // Parsea la respuesta del servidor en formato JSON.
      gastos = data.gastos; // Almacena los gastos obtenidos en la variable gastos.
    };

    const imprimir = async () => {
      try {
        await getRoommates();
        await getGastos();
        $("#roommates").html("");
        $("#roommatesSelect").html("");
        $("#roommatesSelectModal").html("");
        roommates.forEach((r) => {
          $("#roommatesSelect").append(`
          <option value="${r.nombre}">${r.nombre}</option>
          `);
          $("#roommatesSelectModal").append(`
          <option value="${r.nombre}">${r.nombre}</option>
          `);
          $("#roommates").append(`
                  <tr>
                    <td>${r.nombre}</td>
                    <td class="text-danger">${r.debe ? r.debe : "-"}</td>
                    <td class="text-success">${r.recibe ? r.recibe : "-"}</td>
                  </tr>
              `);
        });
        $("#gastosHistorial").html("");
        gastos.forEach((g) => {
          $("#gastosHistorial").append(`
                <tr>
                  <td>${g.roommate}</td>
                  <td>${g.descripcion}</td>
                  <td>${g.monto}</td>
                  <td class="d-flex align-items-center justify-content-between">
                    <i class="fas fa-edit text-warning" onclick="editGasto('${g.id}')" data-toggle="modal" data-target="#exampleModal"></i>
                    <i class="fas fa-trash-alt text-danger" onclick="deleteGasto('${g.id}')" ></i>
                  </td>
                </tr>
              `);
        });
      } catch (e) {
        console.log(e);
      }
    };

    const nuevoRoommate = () => {
      fetch("http://localhost:3000/roommate", { method: "POST" })
        .then((res) => res.json())
        .then(() => {
          imprimir();
        });
    };

    const agregarGasto = async () => {
      const roommateSelected = $("#roommatesSelect").val();
      const descripcion = $("#descripcion").val();
      const monto = Number($("#monto").val());
      await fetch("http://localhost:3000/gasto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roommate: roommateSelected,
          descripcion,
          monto,
        }),
      });
      imprimir();
    };

    const deleteGasto = async (id) => {
      await fetch("http://localhost:3000/gasto?id=" + id, {
        method: "DELETE",
      });
      imprimir();
    };


    const updateGasto = async () => {
      const roommateSelected = $("#roommatesSelectModal").val();
      const descripcion = $("#descripcionModal").val();
      const monto = Number($("#montoModal").val());
      const idUpdate = $("#idModal").val();

      console.log("Datos a enviar en la solicitud POST:");
      console.log("id:", idUpdate);
      console.log("roommate:", roommateSelected);
      console.log("descripcion:", descripcion);
      console.log("monto:", monto);

      await fetch("http://localhost:3000/gasto/" + idUpdate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roommate: roommateSelected,
          descripcion,
          monto,
        }),
      });
      $("#exampleModal").modal("hide");
      imprimir();
    };

    const editGasto = (id) => {
      gastoEditing = id;
      $("#idModal").val(id);
      const { roommate, descripcion, monto } = gastos.find((g) => g.id == id);
      $("#roommatesSelectModal").val(roommate);
      $("#descripcionModal").val(descripcion);
      $("#montoModal").val(monto);
    };

    imprimir();
